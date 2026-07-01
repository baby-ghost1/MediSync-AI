import {
  generateAccessToken,
  generateRefreshToken,
} from "./generateTokens.js";

const sendToken = async (
  res,
  user,
  statusCode = 200,
  message = "Success"
) => {
  const token =
    generateAccessToken(user);

  const refreshToken =
    generateRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateModifiedOnly: true });

  res.cookie("token", token, {
    httpOnly: true,

    secure:
      process.env.NODE_ENV ===
      "production",

    sameSite: "strict",

    maxAge:
      7 *
      24 *
      60 *
      60 *
      1000,
  });

  res.cookie(
    "refreshToken",
    refreshToken,
    {
      httpOnly: true,

      secure:
        process.env.NODE_ENV ===
        "production",

      sameSite: "strict",

      maxAge:
        30 *
        24 *
        60 *
        60 *
        1000,
    }
  );

  const safeUser = user.toObject
    ? user.toObject()
    : { ...user };

  delete safeUser.password;
  delete safeUser.refreshToken;
  delete safeUser.verifyToken;
  delete safeUser.verifyTokenExpire;
  delete safeUser.resetPasswordToken;
  delete safeUser.resetPasswordExpire;

  return res.status(statusCode).json({
    success: true,

    message,

    token,

    refreshToken,

    user: safeUser,
  });
};

export default sendToken;
