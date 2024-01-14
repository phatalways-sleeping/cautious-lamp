const factory = require("./handleFactory");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

// Administrative operations
exports.getAll = factory.getAll(User);
exports.getOne = factory.getOne(User);
exports.createOne = factory.createOne(User);
exports.updateOne = factory.updateOne(User);
exports.deleteOne = factory.deleteOne(User);

// Normal Operations
exports.getMe = catchAsync(async (req, res, _) => {
  const { id } = req.user;
  const user = await User.findById(id);
  res.status(200).json({ status: "success", data: user });
});
