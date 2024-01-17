const catchAsync = require("../utils/catchAsync");
const Project = require("../models/projectModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Theme = require("../models/themeModel");
const excludeFields = require("../utils/excludeFields");
const { ProjectTask, ThemeTask } = require("../models/taskModel");

exports.restrict = (...roles) =>
  catchAsync(async (req, _, next) => {
    const { id } = req.user;
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return next(new AppError(`No document found with ID: ${projectId}`, 404));
    }

    const verifyManager = roles.includes("manager") && project.manager === id;
    const verifyColaborator =
      roles.includes("colaborator") && project.colaborators.includes(id);

    if (!verifyManager && !verifyColaborator) {
      return next(
        new AppError(
          "You do not have the permission to perform this action",
          400
        )
      );
    }

    req.project = project;

    return next();
  });

exports.getOne = catchAsync(async (req, res, next) => {
  const { project } = req;

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
  // To update the information of the project, you must be the manager
  const { id } = req.user;
  const { project } = req;

  if (project.manager !== id) {
    return next(
      new AppError("You do not have the permission to perform this action", 400)
    );
  }

  // Manager can only update the title, description,
  if (req.body.title) {
    project.title = req.body.title;
  }
  if (req.body.description) {
    project.description = req.body.description;
  }

  await project.save({
    runValidators: true,
  });

  return res.status(201).json({
    status: "success",
    data: project,
  });
});

exports.addColaborators = catchAsync(async (req, res, _) => {
  // To update the information of the project, you must be the manager
  const { project } = req;

  project.colaborators = [...project.colaborators, ...req.body.data];

  await project.save({
    runValidators: true,
  });

  return res.status(201).json({
    status: "success",
    data: project,
  });
});

exports.removeColaborators = catchAsync(async (req, res, _) => {
  // To update the information of the project, you must be the manager
  const { id } = req.user;
  const { project } = req;

  let toRemoveColaborators = req.body.data;

  // 1) The manager cannot remove himself
  toRemoveColaborators = toRemoveColaborators.filter((member) => member !== id);
  // 2) Filter out
  project.colaborators = project.colaborators.filter(
    (member) => !toRemoveColaborators.includes(member)
  );

  await project.save({
    runValidators: true,
  });

  return res.status(201).json({
    status: "success",
    data: project,
  });
});

exports.deleteProject = catchAsync(async (req, res, _) => {
  const { id, tasks } = req.project;

  // 1) Find all the tasks of the project and delete
  const docs = await Promise.all(
    tasks.map((taskId) => ProjectTask.findById(taskId))
  );
  await Promise.all(
    docs.map((doc) => {
      doc.isDeleted = true;
      return doc.save();
    })
  );
  // 2) Find all the themes of the project,
  const themes = await Theme.find({
    project: id,
  });
  await Promise.all(
    themes.forEach(async (theme) => {
      // For each task, mark isDeleted
      await Promise.all(
        theme.tasks.forEach((taskId) =>
          ThemeTask.findByIdAndUpdate(taskId, {
            isDeleted: true,
          })
        )
      );
      // Mark the theme isDeleted
      theme.isDeleted = true;
      theme.save();
    })
  );
  // 3) Delete the project
  await Project.findByIdAndUpdate(id, { isDeleted: true });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.addTasks = catchAsync(async (req, res, _) => {
  // Only manager and colaborators within a project are able to
  // add tasks. These tasks inherit Task, called ProjectTask
  const { id } = req.project;
  const restrictedFields = excludeFields("Task");
  const taskObjs = req.body.data;
  taskObjs.forEach((taskObj) => {
    restrictedFields.forEach((field) => delete taskObj[field]);
  });

  const docs = await Promise.all(
    taskObjs.map((taskObj) => ProjectTask.create({ ...taskObj, project: id }))
  );

  res.status(201).json({
    status: "success",
    results: docs.length,
    data: {
      data: docs,
    },
  });
});

exports.deleteTasks = catchAsync(async (req, res, next) => {
  // Only manager and colaborators within a project are able to
  // remove tasks. These tasks inherit Task, called ProjectTask
  const { project } = req;
  const ids = req.body.data;

  if (!ids.every((id) => project.tasks.includes(id))) {
    return next(new AppError(`Invalid task ids: ${ids}`), 400);
  }

  await Promise.all(
    ids.map((id) => ProjectTask.findByIdAndUpdate(id, { isDeleted: true }))
  );

  project.tasks = project.tasks.filter((task) => !ids.includes(task));

  await project.save();

  return res.status(200).json({
    status: "success",
    data: project,
  });
});

exports.moveTask = catchAsync(async (req, res, next) => {
  // Move a task from a project (ProjectTask) to
  // a theme (ThemeTask)
  const { project } = req;
  const { taskId, themeId } = req.body;

  if (!project.tasks.includes(taskId)) {
    return next(new AppError(`Invalid task id ${taskId}`), 400);
  }

  const theme = await Theme.findById(themeId);

  if (!theme) {
    return next(new AppError(`No document found with ID: ${themeId}`), 404);
  }

  if (theme.project !== project.id) {
    return next(
      new AppError(`Cannot move task to a theme outside of a project`, 400)
    );
  }

  if (theme.tasks.includes(taskId)) {
    return next(
      new AppError(`Theme ${themeId} has already had task ${taskId}`, 400)
    );
  }

  const task = await ProjectTask.findByIdAndUpdate(
    taskId,
    {
      kind: "ThemeTask",
      theme: themeId,
      project: undefined,
    },
    {
      overwriteDiscriminatorKey: true,
      new: true,
      runValidators: true,
    }
  );

  return res.status(200).json({
    status: "success",
    data: task,
  });
});
