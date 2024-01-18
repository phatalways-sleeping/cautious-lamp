const { Task } = require("../models/taskModel");
const Theme = require("../models/themeModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const excludeFields = require("../utils/excludeFields");

exports.getAll = catchAsync(async (req, res, _) => {
  const { id } = req.user;

  const { projectId } = req.params;

  const docs = await Theme.find({ project: projectId });

  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.project;
  const { themeId } = req.params;

  const theme = await Theme.findById(themeId);

  if (!theme || theme.project.toString() !== id) {
    return next(
      new AppError(`No theme ID ${themeId} within the project ID ${id}`, 404)
    );
  }

  return res.status(200).json({
    status: "success",
    data: theme,
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const projectId = req.project.id;
  const { id } = req.user;
  const restrictedFields = excludeFields("Theme");
  restrictedFields.forEach((field) => delete req.body[field]);
  const doc = await Theme.create({
    ...req.body,
    creator: id,
    project: projectId,
  });
  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const { themeId } = req.project.id;
  const { id } = req.user;

  const restrictedThemeFields = excludeFields("Theme");
  restrictedThemeFields.forEach((field) => delete req.body[field]);

  const { taskObjs } = req.body;

  req.body.taskObjs = undefined;

  const theme = await Theme.findByIdAndUpdate(themeId, req.body, {
    runValidators: true,
    new: true,
  });

  if (!theme) {
    return next(new AppError(`No document found ID: ${themeId}`, 404));
  }

  if (taskObjs) {
    const restrictedTaskFields = excludeFields("Task");

    restrictedTaskFields.forEach((field) => {
      taskObjs.forEach((taskObj) => delete taskObj[field]);
    });

    const newTasks = await Promise.all(
      taskObjs.map((taskObj) => Task.create({ ...taskObj, creator: id }))
    );

    const newTaskIds = newTasks.map((task) => task.id);

    theme.tasks = [...theme.tasks, newTaskIds];

    await theme.save();
  }

  return res.status(200).json({
    status: "success",
    data: theme,
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const { themeId } = req.project.id;

  const theme = await Theme.findByIdAndUpdate(
    themeId,
    { isDeleted: true },
    {
      runValidators: true,
      new: true,
    }
  );

  if (!theme) {
    return next(new AppError(`No document found ID: ${themeId}`, 404));
  }

  return res.status(204).json({
    status: "success",
    data: null,
  });
});
