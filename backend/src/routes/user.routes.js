import { Router } from "express";

import {
  UserController,
} from "../controllers/index.js";

import {
  auth,
  authorize,
} from "../middleware/index.js";

const router = Router();

router.use(auth);

router.get(
  "/profile",
  UserController.getProfile
);

router.patch(
  "/profile",
  UserController.updateProfile
);

router.get(
  "/search",
  authorize("admin"),
  UserController.searchUsers
);

router.get(
  "/statistics",
  authorize("admin"),
  UserController.getStatistics
);

router.get(
  "/",
  authorize("admin"),
  UserController.getUsers
);

router.get(
  "/:id",
  authorize("admin"),
  UserController.getUser
);

router.patch(
  "/:id/verify",
  authorize("admin"),
  UserController.verifyUser
);

router.patch(
  "/:id/block",
  authorize("admin"),
  UserController.blockUser
);

router.patch(
  "/:id/unblock",
  authorize("admin"),
  UserController.unblockUser
);

router.delete(
  "/:id",
  authorize("admin"),
  UserController.deleteUser
);

export default router;