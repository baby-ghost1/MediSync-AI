import jwt from "jsonwebtoken";

import User from "../models/User.js";

import asyncHandler from "./asyncHandler.js";

const auth = asyncHandler(
  async (req, res, next) => {
    const bearer = req.headers.authorization;
    const cookieToken = req.cookies?.token;

    if (
      (!bearer || !bearer.startsWith("Bearer ")) &&
      !cookieToken
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const token = bearer?.startsWith("Bearer ")
      ? bearer.split(" ")[1]
      : cookieToken;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user =
      await User.findById(
        decoded.id
      ).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User not found.",
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked.",
      });
    }

    req.user = user;

    next();
  }
);

export default auth;
