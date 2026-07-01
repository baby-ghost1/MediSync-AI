import {
  AuthService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class AuthController {
  register = asyncHandler(
    async (req, res) => {
      await AuthService.register(
        req.body,
        res
      );
    }
  );

  login = asyncHandler(
    async (req, res) => {
      await AuthService.login(
        req.body.email,
        req.body.password,
        res
      );
    }
  );

  me = asyncHandler(
    async (req, res) => {
      const data =
        await AuthService.me(
          req.user._id
        );

      res.json({
        success: true,
        data,
      });
    }
  );

  logout = asyncHandler(
    async (req, res) => {
      const data =
        await AuthService.logout(
          req.user._id,
          res
        );

      res.json(data);
    }
  );

  refreshToken =
    asyncHandler(
      async (req, res) => {
        await AuthService.refreshToken(
          req.cookies.refreshToken || req.body.refreshToken,
          res
        );
      }
    );

  forgotPassword =
    asyncHandler(
      async (req, res) => {
        const data =
          await AuthService.forgotPassword(
            req.body.email
          );

        res.json(data);
      }
    );

  resetPassword =
    asyncHandler(
      async (req, res) => {
        const data =
          await AuthService.resetPassword(
            req.body.token,
            req.body.password
          );

        res.json(data);
      }
    );

  verifyEmail =
    asyncHandler(
      async (req, res) => {
        const data =
          await AuthService.verifyEmail(
            req.body.token
          );

        res.json(data);
      }
    );

  changePassword =
    asyncHandler(
      async (req, res) => {
        const data =
          await AuthService.changePassword(
            req.user._id,
            req.body.currentPassword,
            req.body.newPassword
          );

        res.json(data);
      }
    );

  updateProfile =
    asyncHandler(
      async (req, res) => {
        const data =
          await AuthService.updateProfile(
            req.user._id,
            req.body
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  uploadAvatar =
    asyncHandler(
      async (req, res) => {
        const data =
          await AuthService.uploadAvatar(
            req.user._id,
            req.body
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  deleteAccount =
    asyncHandler(
      async (req, res) => {
        const data =
          await AuthService.deleteAccount(
            req.user._id
          );

        res.json(data);
      }
    );
}

export default new AuthController();
