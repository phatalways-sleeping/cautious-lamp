const mongoose = require("mongoose");

const catchAsync = require("../utils/catchAsync");
const Project = require("../models/projectModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
const Theme = require("../models/themeModel");
const excludeFields = require("../utils/excludeFields");
const { ProjectTask, Task } = require("../models/taskModel");

exports.restrictAccessViaProject = catchAsync(async (req, _, next) => {
  const { id } = req.user;

  const { projectId } = req.params;

  const project = await Project.findOne({
    _id: projectId,
    colaborators: id,
  });

  if (!project) {
    return next(
      new AppError(`You do not have permission to perform this action`, 400)
    );
  }

  return next();
});

const restrict = async (userId, projectId, isManager) => {
  const options = {
    colaborators: {
      $in: userId,
    },
  };

  if (isManager) {
    options.manager = userId;
  }

  const project = await Project.findById(projectId, null, {});

  return project;
};

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.user;
  const { projectId } = req.params;

  const features = new APIFeatures(
    Project.findById(projectId, null, {
      colaborators: id,
    }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const results = await features.query;

  if (!results) {
    return next(
      new AppError(
        `Either no document found or you have no permission to access. ID: ${projectId}`,
        404
      )
    );
  }

  const project = results.length === 0 ? null : results[0];

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
    req.body.colaborators = [...req.body.colaborators, id];
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
  // Only managers could only add members to the existing project
  const { id } = req.user;

  const { colaborators, newManager, options } = req.body;

  const { projectId } = req.params;

  const restrictedFields = excludeFields("Project");

  restrictedFields.forEach((field) => delete req.body[field]);

  delete req.body.colaborators;
  delete req.body.newManager;
  delete req.body.options;

  const updateObjects = { ...req.body };

  const filterObject = { _id: projectId };

  if (colaborators || newManager) {
    if (colaborators && (!options || !options.add)) {
      return next(
        new AppError(`Missing options when colaborators are initiated`, 400)
      );
    }
    filterObject.manager = id;
    if (options.add) {
      updateObjects.$addToSet = {
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
  }

  const project = await Project.findByIdAndUpdate(filterObject, updateObjects, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(
      new AppError(
        `No document found with ID: ${projectId}. Please recheck your request body. You cannot\n1) Add or remove a person that is not a colaborator\n2) Update a non-existing project\n3) Change colaborators or manager when you are not the manager`,
        404
      )
    );
  }

  return res.status(200).json({
    status: 200,
    data: project,
  });
});

// exports.updateMembers = catchAsync(async (req, res, next) => {
//   // Only managers could only add members to the existing project
//   const { id } = req.user;

//   const { projectId } = req.params;

//   const { colaborators, newManager, options } = req.body;

//   if (!colaborators && !newManager) {
//     return next(
//       new AppError(
//         `Either colaborators or newManager must be assigned to operate`,
//         400
//       )
//     );
//   }

//   if (!colaborators && options) {
//     return next(
//       new AppError(
//         `Missing colaborators when options is assigned to a value`,
//         400
//       )
//     );
//   }

//   const updateObjects = {};

//   if (options && options.add) {
//     updateObjects.$push = {
//       colaborators: {
//         $each: colaborators,
//       },
//     };
//   } else if (colaborators) {
//     updateObjects.$pull = {
//       colaborators: {
//         $in: colaborators,
//       },
//     };
//   }

//   if (newManager) {
//     const updatedcolaborators = updateObjects.$push
//       ? [...updateObjects.$push.colaborators.$each, newManager]
//       : [newManager];
//     updateObjects.$push.colaborators.$each = updatedcolaborators;
//   }

//   const project = await Project.findOneAndUpdate(
//     {
//       _id: projectId,
//       manager: id,
//     },
//     updateObjects,
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   if (!project) {
//     return next(
//       new AppError(
// eslint-disable-next-line max-len
//         `Either no document found with ID: ${projectId} or you do not have permission to perform this action`,
//         404
//       )
//     );
//   }

//   return res.status(200).json({
//     status: "success",
//     data: project,
//   });
// });

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
