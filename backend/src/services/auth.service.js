import crypto from "crypto";
import jwt from "jsonwebtoken";

import {
  UserRepository,
  PatientRepository,
  DoctorRepository,
} from "../repositories/index.js";

import {
  ApiError,
  sendToken,
} from "../utils/index.js";

import { sendEmail } from "../config/mailer.js";

import { AuditService } from "./index.js";

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

class AuthService {
  /* ==========================================
      Register
  ========================================== */
  async register(body, res) {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    } = body;

    const exists = await UserRepository.emailExists(email);

    if (exists) {
      throw new ApiError(409, "Email already exists.");
    }

    const user = await UserRepository.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role,
    });

    if (role === "patient") {
      await PatientRepository.create({
        user: user._id,
      });
    }

    if (role === "doctor") {
      await DoctorRepository.create({
        user: user._id,
      });
    }

    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyTokenHash = crypto
      .createHash("sha256")
      .update(verifyToken)
      .digest("hex");

    user.verifyToken = verifyTokenHash;
    user.verifyTokenExpire = Date.now() + 1000 * 60 * 60 * 24;

    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Verify your account",
      html: `
        <h2>Welcome to MediSync AI</h2>
        <p>Please verify your account.</p>
        <a href="${process.env.CLIENT_URL}/verify-email/${verifyToken}">
          Verify Email
        </a>
      `,
    });

    return sendToken(res, user, 201, "Registration successful.");
  }

  /* ==========================================
      Login
  ========================================== */
  async login(email, password, res, ip = "", userAgent = "") {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (user.lockUntil && user.lockUntil > new Date()) {
      const remaining = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
      throw new ApiError(429, `Account temporarily locked. Try again in ${remaining} minutes.`);
    }

    const matched = await user.comparePassword(password);

    if (!matched) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
        user.loginAttempts = 0;
        await user.save();

        AuditService.log({
          actor: user._id,
          action: "LOGIN_FAIL",
          metadata: { reason: "Account locked after max attempts", ip },
          ip,
          userAgent,
        });

        throw new ApiError(429, `Account locked for ${LOCK_DURATION_MINUTES} minutes due to too many failed attempts.`);
      }

      await user.save();

      AuditService.log({
        actor: user._id,
        action: "LOGIN_FAIL",
        metadata: { attempt: user.loginAttempts, ip },
        ip,
        userAgent,
      });

      throw new ApiError(401, "Invalid email or password.");
    }

    if (user.role === "admin") {
      throw new ApiError(403, "Admins must use the Admin Portal login.");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Account blocked.");
    }

    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();

    await UserRepository.updateLastLogin(user._id);

    AuditService.log({
      actor: user._id,
      action: "LOGIN_SUCCESS",
      metadata: { ip },
      ip,
      userAgent,
    });

    return sendToken(res, user, 200, "Login successful.");
  }

  /* ==========================================
      Current User
  ========================================== */
  async me(userId) {
    const user = await UserRepository.getProfile(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  /* ==========================================
      Logout
  ========================================== */
  async logout(userId, res) {
    await UserRepository.clearRefreshToken(userId);

    res.clearCookie("token");
    res.clearCookie("refreshToken");

    return {
      success: true,
      message: "Logged out successfully.",
    };
  }

  /* ==========================================
      Refresh Token
  ========================================== */
  async refreshToken(refreshToken, res) {
    if (!refreshToken) {
      throw new ApiError(401, "Refresh token is required.");
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
      throw new ApiError(401, "Invalid refresh token.");
    }

    const user = await UserRepository.findOne({
      _id: decoded.id,
      refreshToken,
    });

    if (!user) {
      throw new ApiError(401, "Refresh token has been revoked.");
    }

    return sendToken(res, user, 200, "Token refreshed successfully.");
  }

  /* ==========================================
      Verify Email
  ========================================== */
  async verifyEmail(token) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await UserRepository.findByVerificationToken(tokenHash);

    if (!user) {
      throw new ApiError(400, "Verification link expired.");
    }

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpire = undefined;

    await user.save();

    return {
      success: true,
      message: "Email verified successfully.",
    };
  }

  /* ==========================================
      Forgot Password
  ========================================== */
  async forgotPassword(email) {
    const user = await UserRepository.findOne({ email });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      user.resetPasswordToken = tokenHash;
      user.resetPasswordExpire = Date.now() + 1000 * 60 * 15;

      await user.save();

      await sendEmail({
        to: user.email,
        subject: "Reset Password",
        html: `
          <h2>Password Reset</h2>
          <a href="${process.env.CLIENT_URL}/reset-password/${token}">
            Reset Password
          </a>
        `,
      });
    }

    return {
      success: true,
      message: "If the account exists, a reset link has been sent.",
    };
  }

  /* ==========================================
      Reset Password
  ========================================== */
  async resetPassword(token, password) {
    const tokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");
    const user = await UserRepository.findByResetToken(tokenHash);

    if (!user) {
      throw new ApiError(400, "Invalid reset token.");
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    await UserRepository.clearRefreshToken(user._id);

    return {
      success: true,
      message: "Password updated successfully.",
    };
  }

  /* ==========================================
      Change Password
  ========================================== */
  async changePassword(userId, currentPassword, newPassword) {
    const user = await UserRepository.findByIdWithPassword(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const matched = await user.comparePassword(currentPassword);

    if (!matched) {
      throw new ApiError(400, "Current password is incorrect.");
    }

    user.password = newPassword;
    await user.save();

    await UserRepository.clearRefreshToken(user._id);

    return {
      success: true,
      message: "Password changed successfully.",
    };
  }

  /* ==========================================
      Update Profile
  ========================================== */
  async updateProfile(userId, payload) {
    const user = await UserRepository.updateProfile(userId, payload);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  /* ==========================================
      Upload Avatar
  ========================================== */
  async uploadAvatar(userId, avatar) {
    const user = await UserRepository.updateAvatar(userId, avatar);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  /* ==========================================
      Delete Account
  ========================================== */
  async deleteAccount(userId) {
    const user = await UserRepository.findByIdAndDelete(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return {
      success: true,
      message: "Account deleted successfully.",
    };
  }
}

export default new AuthService();
