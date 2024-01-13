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
      return next(new AppError(`No document found with ID: ${id}`), 404);
    }
    return res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });
