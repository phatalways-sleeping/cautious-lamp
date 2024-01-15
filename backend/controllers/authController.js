const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { signToken } = require("../utils/signToken");

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Send httpOnly Cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number.parseInt(process.env.JWT_EXPIRES_IN.split("d")[0], 10) *
          24 *
          60 *
          60 *
          1000
    ),
    secure: true,
  };

  if (process.env.NODE_ENV === "prod") {
    cookieOptions.secure = true;
  }
  res.cookie("jwt", token, cookieOptions);
  //
  user.password = undefined;
  return res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.protect = catchAsync(async (req, _, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You do not have any token to perform this action", 403)
    );
  }
  // 1) Validate the token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 2) Check if the user still exists
  const user = await User.findById(decode.id);
  if (!user) {
    return next(
      new AppError("The owner of this account is not available", 401)
    );
  }
  // 3) Check if the user has changed the password
  if (user.changePasswordAfter(decode.iat)) {
    return next(new AppError("The account has changed its password", 401));
  }
  // 4) Verify
  req.user = user;
  return next();
});

exports.restrict = (...roles) =>
  catchAsync(async (req, _, next) => {
    const { role } = req.user;

    if (roles.indexOf(role) === -1) {
      return next(
        new AppError(
          "You do not have the permission to perform this action",
          403
        )
      );
    }

    return next();
  });

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide both email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Either email or password is incorrect", 401));
  }

  return createAndSendToken(user, 200, res);
});

exports.signUp = catchAsync(async (req, res, next) => {
  const { email, password, passwordConfirm } = req.body;
  if (!email || !password || !passwordConfirm) {
    return next(
      new AppError(
        "Either email, password, or password confirm is missing",
        400
      )
    );
  }
  const newUser = await User.create({
    email,
    password,
    passwordConfirm,
  });
  newUser.role = undefined;
  newUser.createdAt = undefined;
  newUser.active = undefined;
  newUser.__v = undefined;
  return createAndSendToken(newUser, 201, res);
});

exports.logout = catchAsync(async (_, res, __) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the email from the request body
  const { email } = req.body;
  // 2) Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError(`Cannot find any user with email: ${email}`), 404);
  }
  // 3) Create password reset token
  const resetToken = user.createPasswordToken();
  await user.save({
    validateBeforeSave: false,
  });
  try {
    // Send to email
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpired = undefined;
    user.save({
      validateBeforeSave: false,
    });
    return next(new AppError(`Cannot send token to the email: ${email}`, 404));
  }
  return res.status(200).json({
    status: "success",
    message: "Token sent to email",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, token } = req.body;
  const resetToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetTokenExpired: {
      $gt: Date.now(),
    },
  });
  if (!user) {
    return next(new AppError("Either token is incorrect or has expired", 400));
  }
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpired = undefined;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  return createAndSendToken(user, 200, res);
});

exports.deleteMe = catchAsync(async (req, res, _) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { isDeleted: true });

  res.status(200).json({ status: "success", data: null });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, passwordConfirm, currentPassword } = req.body;
  const { id } = req.user;
  const user = await User.findById(id).select("+password");
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Current password is incorrect", 401));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  return createAndSendToken(user, 200, res);
});
