const factory = require("./handleFactory");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

// Administrative operations
exports.getAll = factory.getAll(User);

exports.getOne = factory.getOne(User);

exports.createOne = factory.createOne(User);

exports.updateOne = factory.updateOne(User);

exports.deleteMe = catchAsync(async (req, res, _) => {
  const { id } = req.user;

  await User.findByIdAndUpdate(id, { active: false }, { new: true });

  res.status(204).json({
    status: 200,
    data: null,
  });
});

// Normal Operations
exports.getMe = catchAsync(async (req, res, _) => {
  const { id } = req.user;

  const user = await User.findById(id);

  const projects = await user.projects();

  const data = {
    email: user.email,
    id: user.id,
    projects,
  };

  res.status(200).json({ status: "success", data });
});
