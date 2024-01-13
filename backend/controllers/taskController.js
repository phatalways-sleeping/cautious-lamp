const { Task } = require("../models/taskModel");
const factory = require("./handleFactory");

exports.getAll = factory.getAll(Task);
exports.getOne = factory.getOne(Task);
