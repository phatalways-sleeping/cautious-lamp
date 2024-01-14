const factory = require("./handleFactory");
const User = require("../models/userModel");

// Administrative operations
exports.getAll = factory.getAll(User);
exports.getOne = factory.getOne(User);
exports.createOne = factory.createOne(User);
exports.updateOne = factory.updateOne(User);
exports.deleteOne = factory.deleteOne(User);
