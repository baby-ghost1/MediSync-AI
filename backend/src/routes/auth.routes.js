import { Router } from "express";

import {
  AuthController,
} from "../controllers/index.js";

import {
  auth,
  validate,
} from "../middleware/index.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  verifyEmailSchema,
} from "../validators/index.js";

const router = Router();

router.post(
  "/register",
  validate(registerSchema),
  AuthController.register
);

router.post(
  "/login",
  validate(loginSchema),
  AuthController.login
);

router.post(
  "/refresh-token",
  AuthController.refreshToken
);

router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  AuthController.resetPassword
);

router.post(
  "/verify-email",
  validate(verifyEmailSchema),
  AuthController.verifyEmail
);

router.get(
  "/me",
  auth,
  AuthController.me
);

router.patch(
  "/change-password",
  auth,
  validate(changePasswordSchema),
  AuthController.changePassword
);

router.patch(
  "/profile",
  auth,
  AuthController.updateProfile
);

router.patch(
  "/avatar",
  auth,
  AuthController.uploadAvatar
);

router.post(
  "/logout",
  auth,
  AuthController.logout
);

router.delete(
  "/account",
  auth,
  AuthController.deleteAccount
);

export default router;