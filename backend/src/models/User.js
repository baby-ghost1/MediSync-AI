import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    phone: {
      type: String,
      default: "",
    },

    avatar: {
      url: String,
      publicId: String,
    },

    role: {
      type: String,
      enum: [
        "patient",
        "doctor",
        "admin",
      ],
      default: "patient",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    refreshToken: String,

    verifyToken: {
      type: String,
      select: false,
      index: true,
    },

    verifyTokenExpire: {
      type: Date,
      select: false,
    },

    resetPasswordToken: {
      type: String,
      select: false,
      index: true,
    },

    resetPasswordExpire: {
      type: Date,
      select: false,
    },

    lastLogin: Date,

    loginAttempts: {
      type: Number,
      default: 0,
    },

    lockUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre(
  "save",
  async function () {
    if (!this.isModified("password")) {
      return;
    }

    this.password = await bcrypt.hash(
      this.password,
      12
    );
  }
);

userSchema.set("toJSON", {
  transform: (document, result) => {
    delete result.password;
    delete result.refreshToken;
    delete result.verifyToken;
    delete result.verifyTokenExpire;
    delete result.resetPasswordToken;
    delete result.resetPasswordExpire;
    delete result.loginAttempts;
    delete result.lockUntil;
    return result;
  },
});

userSchema.methods.comparePassword =
  function (password) {
    return bcrypt.compare(
      password,
      this.password
    );
  };

userSchema.methods.generateAccessToken =
  function () {
    return jwt.sign(
      {
        id: this._id,
        role: this.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn:
          process.env.JWT_EXPIRES_IN,
      }
    );
  };

userSchema.methods.generateRefreshToken =
  function () {
    return jwt.sign(
      {
        id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn:
          process.env
            .REFRESH_TOKEN_EXPIRES_IN,
      }
    );
  };

export default mongoose.model(
  "User",
  userSchema
);
