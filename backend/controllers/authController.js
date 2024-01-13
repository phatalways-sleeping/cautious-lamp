const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { signToken } = require("../utils/signToken");

const createAndSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  // Cookies
  const cookieOptions = {
    expires: new Date() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000,
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
    [, token] = req.headers.authorization.splits(" ");
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You do not have any token to perform this action", 403)
    );
  }
  // 1) Validate the token
  const decode = await promisify(jwt.decode)(token, process.env.JWT_SECRET);
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
