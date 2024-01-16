const catchAsync = require("../utils/catchAsync");
const Project = require("../models/projectModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Theme = require("../models/themeModel");
const excludeFields = require("../utils/excludeFields");
const { ProjectTask, ThemeTask } = require("../models/taskModel");

exports.restrict = catchAsync(async (req, _, next) => {
  const { id } = req.user;
  const { projectId } = req.params;

  const project = await Project.findById(projectId);

  if (project.manager !== id) {
    return next(
      new AppError("You do not have the permission to perform this action", 400)
    );
  }

  req.project = project;

  return next();
});

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { projectId } = req.params;

  const project = await Project.findById(
    projectId,
    {},
    {
      colaborators: id,
    }
  );

  if (!project) {
    return next(
      new AppError(
        `Either no project found with ID: ${projectId} or you do not have permission to access this document`
      ),
      404
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

  project.colaborators = [...project.colaborators, ...req.body.colaborators];

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

  let toRemoveColaborators = req.body.colaborators;

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
