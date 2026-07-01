import {
  UserRepository,
} from "../repositories/index.js";

import {
  ApiError,
} from "../utils/index.js";

class UserService {
  /* ==========================================
      Profile
  ========================================== */

  async getProfile(userId) {
    const user =
      await UserRepository.getProfile(
        userId
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }

  async updateProfile(
    userId,
    payload
  ) {
    const user =
      await UserRepository.updateProfile(
        userId,
        payload
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }

  async updateAvatar(
    userId,
    avatar
  ) {
    const user =
      await UserRepository.updateAvatar(
        userId,
        avatar
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }

  /* ==========================================
      Users
  ========================================== */

  async getUsers(query) {
    const {
      page = 1,
      limit = 10,
      role,
      verified,
      blocked,
    } = query;

    const filter = {};

    if (role)
      filter.role = role;

    if (verified !== undefined)
      filter.isVerified =
        verified === "true";

    if (blocked !== undefined)
      filter.isBlocked =
        blocked === "true";

    return UserRepository.find(
      filter,
      {
        page,
        limit,
      }
    );
  }

  async getUser(id) {
    const user =
      await UserRepository.getProfile(
        id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }

  async searchUsers(
    keyword,
    page,
    limit
  ) {
    return UserRepository.search(
      keyword,
      page,
      limit
    );
  }

  /* ==========================================
      Verification
  ========================================== */

  async verifyUser(id) {
    const user =
      await UserRepository.verifyUser(
        id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return user;
  }
    /* ==========================================
      Block / Unblock
  ========================================== */

  async blockUser(id) {
    const user =
      await UserRepository.blockUser(
        id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return {
      success: true,
      message:
        "User blocked successfully.",
      user,
    };
  }

  async unblockUser(id) {
    const user =
      await UserRepository.unblockUser(
        id
      );

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return {
      success: true,
      message:
        "User unblocked successfully.",
      user,
    };
  }

  /* ==========================================
      Delete
  ========================================== */

  async deleteUser(id) {
    const user =
      await UserRepository.delete(id);

    if (!user) {
      throw new ApiError(
        404,
        "User not found."
      );
    }

    return {
      success: true,
      message:
        "User deleted successfully.",
    };
  }

  /* ==========================================
      Dashboard
  ========================================== */

  async getDashboardStatistics() {
    return UserRepository.getStatistics();
  }

  /* ==========================================
      Update Last Login
  ========================================== */

  async updateLastLogin(id) {
    return UserRepository.updateLastLogin(
      id
    );
  }

  /* ==========================================
      Email Exists
  ========================================== */

  async emailExists(email) {
    const exists =
      await UserRepository.emailExists(
        email
      );

    return {
      exists: Boolean(exists),
    };
  }

  /* ==========================================
      Count
  ========================================== */

  async countUsers() {
    const total =
      await UserRepository.count();

    return {
      total,
    };
  }
}

export default new UserService();