import {
  UserService,
} from "../services/index.js";

import {
  asyncHandler,
} from "../middleware/index.js";

class UserController {
  getProfile =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.getProfile(
            req.user._id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  updateProfile =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.updateProfile(
            req.user._id,
            req.body
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  getUsers =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.getUsers(
            req.query
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  getUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.getUser(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  searchUsers =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.searchUsers(
            req.query.q,
            req.query.page,
            req.query.limit
          );

        res.json({
          success: true,
          ...data,
        });
      }
    );

  verifyUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.verifyUser(
            req.params.id
          );

        res.json({
          success: true,
          data,
        });
      }
    );

  blockUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.blockUser(
            req.params.id
          );

        res.json(data);
      }
    );

  unblockUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.unblockUser(
            req.params.id
          );

        res.json(data);
      }
    );

  deleteUser =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.deleteUser(
            req.params.id
          );

        res.json(data);
      }
    );

  getStatistics =
    asyncHandler(
      async (req, res) => {
        const data =
          await UserService.getDashboardStatistics();

        res.json({
          success: true,
          data,
        });
      }
    );
}

export default new UserController();