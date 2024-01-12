const User = require("../models/userModel");

const user1 = new User({
  email: "john@gmail.com",
  password: "123456789@",
  passwordConfirm: "123456789@",
});

const user2 = new User({
  email: "peter@gmail.com",
  password: "123456789@",
  passwordConfirm: "123456789@",
});

const user3 = new User({
  email: "jane@gmail.com",
  password: "123456789@",
  passwordConfirm: "123456789@",
});

const users = [user1, user2, user3];

module.exports = users;
