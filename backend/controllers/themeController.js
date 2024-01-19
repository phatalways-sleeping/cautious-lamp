const Project = require("../models/projectModel");
const { Task, ThemeTask } = require("../models/taskModel");
const Theme = require("../models/themeModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const excludeFields = require("../utils/excludeFields");

exports.getAll = catchAsync(async (req, res, _) => {
  const { projectId } = req.params;

  const docs = await Theme.find({ project: projectId }, null, {
    sort: {
      createdAt: -1,
    },
  });

  res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { themeId } = req.params;

  const theme = await Theme.findById(themeId);

  if (!theme) {
    return next(new AppError(`No document found with ID: ${themeId}`, 404));
  }

  return res.status(200).json({
    status: "success",
    data: theme,
  });
});

exports.createOne = catchAsync(async (req, res, next) => {
  const { projectId } = req.params;
  if (!projectId) {
    return next(
      new AppError(
        "Missing projectId when requesting to create new project",
        400
      )
    );
  }
  const { id } = req.user;

  const restrictedFields = excludeFields("Theme");

  restrictedFields.forEach((field) => delete req.body[field]);

  const doc = await Theme.create({
    ...req.body,
    creator: id,
    project: projectId,
  });

  return res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const { themeId } = req.params;

  const restrictedThemeFields = excludeFields("Theme");

  restrictedThemeFields.forEach((field) => delete req.body[field]);

  const theme = await Theme.findByIdAndUpdate(
    themeId,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  if (!theme) {
    return next(new AppError(`No document found ID: ${themeId}`, 404));
  }

  return res.status(200).json({
    status: "success",
    data: theme,
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const { themeId } = req.params;

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
