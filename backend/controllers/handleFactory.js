const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAll = (Model) =>
  catchAsync(async (req, res, _) => {
    const features = new APIFeatures(
      Model.find(),
      req.query
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const docs = await features.query;
    res.status(200).json({
      status: "success",
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const query = Model.findById(id);
    const doc = await query;
    if (!doc) {
      return next(new AppError(`Cannot find any document with ID: ${id}`), 404);
    }
    return res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, _) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const query = Model.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    const doc = await query;
    if (!doc) {
      return next(new AppError(`Cannot find any document with ID: ${id}`), 404);
    }
    if (req.body.title) {
      // For updating title of a task, call .save to trigger pre("save")
      await doc.save();
    }
    return res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.deleteOne = (Model, hard = false) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    let doc;
    if (hard) {
      doc = await Model.findByIdAndDelete(id);
    } else {
      doc = await Model.findByIdAndUpdate(
        id,
        {
          isDeleted: true,
        },
        {
          runValidators: true,
          new: true,
        }
      );
    }
    if (!doc) {
      return next(new AppError(`Cannot find any document with ID: ${id}`), 404);
    }
    return res.status(204).json({
      status: "success",
      data: null,
    });
  });
