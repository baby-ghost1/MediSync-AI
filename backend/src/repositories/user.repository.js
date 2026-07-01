import BaseRepository from "./base.repository.js";

import { User } from "../models/index.js";
import { escapeRegex } from "../utils/index.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /* ==========================================
      Auth
  ========================================== */

  async findByEmail(email) {
    return this.model
      .findOne({
        email: email.toLowerCase(),
      })
      .select("+password");
  }

  async findByIdWithPassword(id) {
    return this.model
      .findById(id)
      .select("+password");
  }

  async emailExists(email) {
    return this.model.exists({
      email: email.toLowerCase(),
    });
  }

  async findByVerificationToken(token) {
    return this.model
      .findOne({
        verifyToken: token,
        verifyTokenExpire: { $gt: new Date() },
      })
      .select("+verifyToken +verifyTokenExpire");
  }

  async findByResetToken(token) {
    return this.model
      .findOne({
        resetPasswordToken: token,
        resetPasswordExpire: { $gt: new Date() },
      })
      .select(
        "+resetPasswordToken +resetPasswordExpire +password"
      );
  }

  /* ==========================================
      Profile
  ========================================== */

  async getProfile(id) {
    return this.model
      .findById(id)
      .select("-password -refreshToken");
  }

  async updateProfile(
    id,
    payload
  ) {
    return this.model.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async updateAvatar(
    id,
    avatar
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        avatar,
      },
      {
        new: true,
      }
    );
  }

  async updatePassword(
    id,
    password
  ) {
    const user =
      await this.model.findById(id);

    user.password = password;

    await user.save();

    return user;
  }

  /* ==========================================
      Token
  ========================================== */

  async saveRefreshToken(
    id,
    token
  ) {
    return this.model.findByIdAndUpdate(
      id,
      {
        refreshToken: token,
      }
    );
  }

  async clearRefreshToken(id) {
    return this.model.findByIdAndUpdate(
      id,
      {
        refreshToken: null,
      }
    );
  }

  /* ==========================================
      Status
  ========================================== */

  async verifyUser(id) {
    return this.model.findByIdAndUpdate(
      id,
      {
        isVerified: true,
      },
      {
        new: true,
      }
    );
  }

  async blockUser(id) {
    return this.model.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
  }

  async unblockUser(id) {
    return this.model.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
  }

  async updateLastLogin(id) {
    return this.model.findByIdAndUpdate(
      id,
      {
        lastLogin: new Date(),
      }
    );
  }

  /* ==========================================
      Search
  ========================================== */

  async search(
    keyword,
    page = 1,
    limit = 10
  ) {
    const filter = {
      $or: [
        {
          firstName: {
            $regex: escapeRegex(keyword),
            $options: "i",
          },
        },

        {
          lastName: {
            $regex: escapeRegex(keyword),
            $options: "i",
          },
        },

        {
          email: {
            $regex: escapeRegex(keyword),
            $options: "i",
          },
        },
      ],
    };

    return this.find(filter, {
      page,
      limit,
    });
  }

  /* ==========================================
      Dashboard
  ========================================== */

  async getStatistics() {
    const [
      totalUsers,
      patients,
      doctors,
      admins,
      verified,
    ] = await Promise.all([
      this.count(),

      this.count({
        role: "patient",
      }),

      this.count({
        role: "doctor",
      }),

      this.count({
        role: "admin",
      }),

      this.count({
        isVerified: true,
      }),
    ]);

    return {
      totalUsers,
      patients,
      doctors,
      admins,
      verified,
    };
  }
}

export default new UserRepository();
