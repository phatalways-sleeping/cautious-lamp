const { Task, ThemeTask, ProjectTask } = require("../models/taskModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const excludeFields = require("../utils/excludeFields");
const factory = require("./handleFactory");

exports.getAll = catchAsync(async (req, res, _) => {
  const { Model } = req;
  const { projectId, themeId } = req.params;
  const features = new APIFeatures(
    Model.find({
      project: projectId,
      theme: themeId,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tasks = await features.query;
  res.status(200).json({
    status: "success",
    results: tasks.length,
    data: {
      data: tasks,
    },
  });
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { Model } = req;
  const { id } = req.params;
  const query = Model.findById(id);
  const task = await query;
  if (!task) {
    return next(new AppError(`Cannot find any document with ID: ${id}`), 404);
  }
  return res.status(200).json({
    status: "success",
    data: task,
  });
});

exports.createOne = catchAsync(async (req, res, _) => {
  const { Model } = req;

  const { projectId, themeId } = req.params;

  const { id } = req.user;

  excludeFields("Task").forEach((field) => delete req.body[field]);

  const task = await Model.create({
    ...req.body,
    project: projectId,
    theme: themeId,
    creator: id,
  });

  return res.status(201).json({
    status: "success",
    data: task,
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const { Model } = req;

  const { projectId, themeId } = req.params;

  const { id } = req.params;

  const { options, steps } = req.body;

  req.body.options = undefined;
  req.body.steps = undefined;

  // Update title, description, notes, attachments
  // scheduledDate, category, completion, priority
  // status, dateCompleted, dueDate, steps

  // For steps !== undefined, if options.add --> add more steps to the task
  // else remove steps whose titles are in req.body.steps.title
  if (steps && options && options.add) {
    // Add more steps
    req.body.$push = {
      steps: {
        $each: steps,
      },
    };
  } else if (steps) {
    const titles = steps.map((step) => step.title);
    // Remove steps from tasks
    req.body.$pull = {
      steps: {
        $elemMatch: {
          title: {
            $in: titles,
          },
        },
      },
    };
  }

  const task = await Model.findOneAndUpdate(
    {
      _id: id,
      project: projectId,
      theme: themeId,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    return next(new AppError(`No document found with ID: ${id}`, 404));
  }

  return res.status(200).json({
    status: "success",
    data: task,
  });
});

exports.deleteOne = catchAsync(async (req, res, next) => {
  const { Model } = req;

  const { projectId, themeId } = req.params;

  const { id } = req.params;

  const task = await Model.findOneAndUpdate(
    {
      _id: id,
      project: projectId,
      theme: themeId,
    },
    {
      isDeleted: true,
    },
    { new: true }
  );

  if (!task) {
    return next(new AppError(`No document found with ID: ${id}`, 404));
  }

  return res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.assignModel = catchAsync(async (req, _, next) => {
  const { projectId, themeId } = req.params;
  const { searchAllForTheme } = req;
  if (searchAllForTheme && !themeId && !projectId) {
    return next(
      new AppError(
        `Missing themeId or projectId when searchAllForTheme is given`,
        400
      )
    );
  }
  if (projectId && !searchAllForTheme) {
    req.Model = ProjectTask;
  }
  if (themeId || searchAllForTheme) {
    req.Model = ThemeTask;
  }
  if (!projectId && !themeId && !searchAllForTheme) {
    req.Model = Task;
  }
  return next();
});

exports.restrictsFields = catchAsync(async (req, _, next) => {
  const restrictedFields = excludeFields("Task");
  restrictedFields.forEach((field) => delete req.body[field]);
  next();
});

exports.filterTasks = (today = true) =>
  catchAsync(async (req, _, next) => {
    if (today) {
      req.query.scheduledDate = {
        $eq: Date.now(),
      };
    } else {
      req.query.dueDate = {
        lt: Date.now(),
      };
    }
    next();
  });

exports.setUpTop5NearestTasks = catchAsync(async (req, _, next) => {
  req.query = {
    ...req.query,
    sort: "scheduledDate,-dueDate",
    limit: 5,
  };
  next();
});

exports.setUpTaskCompletion = (status) =>
  catchAsync(async (req, _, next) => {
    req.body = {
      status,
    };
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
