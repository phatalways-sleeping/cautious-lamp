const { Task } = require("../models/taskModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handleFactory");

exports.getAll = factory.getAll(Task);

exports.getOne = (useSlug = false) => factory.getOne(Task, useSlug);

exports.createOne = factory.createOne(Task);

exports.updateOne = factory.updateOne(Task);

exports.deleteOne = factory.deleteOne(Task);

exports.setUpTodayTasks = catchAsync(async (req, _, next) => {
  req.query = {
    ...req.query,
    scheduledDate: {
      $eq: Date.now(),
    },
  };
  console.log(req.query);
  next();
});

exports.setUpTop5NearestTasks = catchAsync(async (req, _, next) => {
  req.query = {
    ...req.query,
    sort: "scheduledDate,-dueDate",
    limit: 5,
  };
  console.log(req.query);
  next();
});

exports.setUpUserId = catchAsync(async (req, _, next) => {
  if (!req.body.user) {
    req.body.creator = req.user.id;
  }
  next();
});

exports.setUpCreatorId = catchAsync(async (req, _, next) => {
  const { id } = req.user;
  req.body.creator = id;
  next();
});

exports.setUpAssigneeId = catchAsync(async (req, _, next) => {
  const { assignee } = req.body;
  if (!assignee) return next();
  const user = await User.findOne({ email: assignee });
  if (!user) {
    return next(
      new AppError(`No assignee found with the email: ${assignee}`),
      404
    );
  }
  req.body.assignee = user.id;
  return next();
});
