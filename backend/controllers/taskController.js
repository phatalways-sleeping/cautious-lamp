const { Task } = require("../models/taskModel");
const factory = require("./handleFactory");

exports.getAll = factory.getAll(Task);
exports.getOne = factory.getOne(Task);
exports.createOne = factory.createOne(Task);
exports.updateOne = factory.updateOne(Task);
exports.deleteOne = factory.deleteOne(Task);
