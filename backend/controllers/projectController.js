const catchAsync = require("../utils/catchAsync");
const Project = require("../models/projectModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Theme = require("../models/themeModel");
const excludeFields = require("../utils/excludeFields");
const { ProjectTask, ThemeTask, Task } = require("../models/taskModel");

const restrict = async (userId, projectId, isManager) => {
  const options = {
    colaborators: userId,
  };

  if (isManager) {
    options.manager = userId;
  }

  const project = await Project.findById(projectId, null, options);

  return project;
};

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { projectId } = req.params;

  const project = restrict(id, projectId, true);

  if (!project) {
    return next(
      new AppError(
        `Either no document found or you have no permission to access. ID: ${projectId}`,
        404
      )
    );
  }

  return res.status(200).json({ status: "success", data: project });
});

exports.getAll = catchAsync(async (req, res, _) => {
  const { id } = req.user;

  const features = new APIFeatures(
    Project.find({
      colaborators: id,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const docs = await features.query;

  return res.status(200).json({
    status: "success",
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.createOne = catchAsync(async (req, res, _) => {
  const { id } = req.user;

  const restrictedFields = excludeFields("Project");
  restrictedFields.forEach((field) => delete req.body[field]);

  const { themes } = req.body;
  delete req.body.themes;

  // Validation
  // 1) If colaborators does not include id, add id to it
  if (!req.body.colaborators) {
    req.body.colaborators = [id];
  } else if (!req.body.colaborators.includes(id)) {
    req.body.colaborators = [...req.colaborators, id];
  }
  // 2) If manager is either undefined or null, set default to id
  req.body.manager = req.body.manager ?? id;

  const project = await Project.create({ ...req.body, creator: id });

  if (themes !== undefined) {
    const projectId = project.id;
    // Looping through the arrays of themes
    // Create themes
    const promises = themes.map((theme) => {
      const data = { ...theme, project: projectId, creator: id };
      return Theme.create(data);
    });

    await Promise.all(promises);
  }

  project.isDeleted = undefined;

  return res.status(201).json({
    status: "success",
    data: project,
  });
});

exports.updateOne = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const { projectId } = req.params;

  const restrictedFields = excludeFields("Project");

  restrictedFields.forEach((field) => delete req.body[field]);

  const { tasks, options } = req.body;

  req.body.tasks = undefined;

  req.body.options = undefined;

  const updateOptions = { ...req.body };

  let taskIds = tasks; // initially default to delete mode if needed

  if (taskIds && options.add) {
    excludeFields("Task").forEach((field) =>
      tasks.forEach((task) => {
        if (typeof task === "string" || task instanceof String) return;
        delete task[field];
      })
    );
    taskIds = await Promise.all(
      tasks.map((task) => {
        if (typeof task === "string" || task instanceof String) {
          // Make sure the creator of the task and its assignee,
          // if exists, must be within the project
          return Task.findByIdAndUpdate(
            task,
            {
              kind: "ProjectTask",
              project: projectId,
            },
            { overwriteDiscriminatorKey: true, new: true }
          );
        }
        return ProjectTask.create({
          ...task,
          creator: id,
        });
      })
    );
    updateOptions.$push = {
      colaborators: {
        $each: taskIds,
      },
    };
  } else if (taskIds) {
    // else: user wants to remove these taskIds from the current project
    updateOptions.$pull = {
      colaborators: {
        $in: taskIds,
      },
    };
  }

  const project = await Project.findByIdAndUpdate(projectId, updateOptions, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(new AppError(`No document found with ID: ${projectId}`, 404));
  }

  return res.status(200).json({
    status: 200,
    data: project,
  });
});

exports.updateMembers = catchAsync(async (req, res, next) => {
  // Only managers could only add members to the existing project
  const { id } = req.user;

  const { projectId } = req.params;

  const { colaborators, newManager, options } = req.body;

  if (!colaborators && !newManager) {
    return next(
      new AppError(
        `Either colaborators or newManager must be assigned to operate`,
        400
      )
    );
  }

  if (!colaborators && options) {
    return next(
      new AppError(
        `Missing colaborators when options is assigned to a value`,
        400
      )
    );
  }

  const updateObjects = {};

  if (options && options.add) {
    updateObjects.$push = {
      colaborators: {
        $each: colaborators,
      },
    };
  } else if (colaborators) {
    updateObjects.$pull = {
      colaborators: {
        $in: colaborators,
      },
    };
  }

  if (newManager) {
    const updatedcolaborators = updateObjects.$push
      ? [...updateObjects.$push.colaborators.$each, newManager]
      : [newManager];
    updateObjects.$push.colaborators.$each = updatedcolaborators;
  }

  const project = await Project.findOneAndUpdate(
    {
      _id: projectId,
      manager: id,
    },
    updateObjects,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!project) {
    return next(
      new AppError(
        `Either no document found with ID: ${projectId} or you do not have permission to perform this action`,
        404
      )
    );
  }

  return res.status(200).json({
    status: "success",
    data: project,
  });
});

exports.deleteProject = catchAsync(async (req, res, next) => {
  const { id } = req.user;

  const { projectId } = req.params;

  const project = await Project.findOne(
    {
      _id: projectId,
      manager: id,
    },
    { isDeleted: true },
    { new: true }
  );

  if (!project) {
    return next(
      new AppError(
        `Either no document found with ID: ${projectId} or you do not have the permission`,
        404
      )
    );
  }

  return res.status(204).json({
    status: "success",
    data: null,
  });
});
