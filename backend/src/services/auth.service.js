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
  async login(email, password, res) {
    const user = await UserRepository.findByEmail(email);

    if (!user) {
      throw new ApiError(401, "Invalid email or password.");
    }

    const matched = await user.comparePassword(password);

    if (!matched) {
      throw new ApiError(401, "Invalid email or password.");
    }

    if (user.role === "admin") {
      throw new ApiError(403, "Admins must use the Admin Portal login.");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Account blocked.");
    }

    await UserRepository.updateLastLogin(user._id);

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

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

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

    return {
      success: true,
      message: "Password reset link sent.",
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
