const factory = require("./handleFactory");
const User = require("../models/userModel");

// Administrative operations
exports.getAll = factory.getAll(User);

exports.getOne = factory.getOne(User);
