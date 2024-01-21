const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const Project = require("./projectModel");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: mongoose.SchemaTypes.String,
      validate: {
        validator(val) {
          return validator.isEmail(val);
        },
        message: "Email must be in a correct format",
      },
      unique: [true, "A email must be unique"],
    },
    password: {
      type: mongoose.SchemaTypes.String,
      minLength: [10, "A password must have at least 10 characters"],
      required: [true, "An account must have a password"],
      select: false,
    },
    passwordConfirm: {
      type: mongoose.SchemaTypes.String,
      validate: {
        validator(val) {
          return val === this.password;
        },
        message: "Password confirm must equal to password",
      },
      required: [true, "An account must have a confirm password"],
    },
    passwordChangedAt: mongoose.SchemaTypes.Date,
    passwordResetToken: mongoose.SchemaTypes.String,
    passwordResetTokenExpired: mongoose.SchemaTypes.Date,
    role: {
      type: mongoose.SchemaTypes.String,
      enum: {
        values: ["admin", "user"],
        message: "An account is either admin or user",
      },
      default: "user",
    },
    createdAt: {
      type: mongoose.SchemaTypes.Date,
      default: Date.now(),
      select: false,
    },
    active: {
      type: mongoose.SchemaTypes.Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Middlewares
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  return next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  return next();
});

userSchema.pre(/^find/, function (next) {
  this.find({
    active: {
      $ne: false,
    },
  });
  return next();
});

userSchema.pre(/^find/, function (next) {
  this.select("-__v -role");
  return next();
});

// Instance methods
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  const result = await bcrypt.compare(candidatePassword, userPassword);
  return result;
};

userSchema.methods.changePasswordAfter = function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const date = Date.parse(this.passwordChangedAt) / 1000;
    return date > jwtTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpired = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.projects = async function () {
  // Get user's projects based on the given status
  const projects = await Project.find(
    {
      colaborators: this._id,
    },
    {
      title: true,
      description: true,
      manager: true,
      colaborators: true,
      complete: true,
    },
    {
      sort: {
        createdAt: -1,
        complete: 1,
      },
    }
  );

  return projects;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
