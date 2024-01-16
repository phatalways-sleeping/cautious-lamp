const Theme = require("../models/themeModel");

module.exports = [
  new Theme({
    title: "Procedural Programming",
    description:
      "Writing functions, implement basic features without creating classes, interfaces",
    creator: "65a1a85cfd837a6b0806c579",
    project: "65a6bee7cba0de3c2ff9bf00",
  }),
  new Theme({
    title: "Object-oriented Programming",
    description: "Classes, SOLID, and more",
    creator: "65a1a85cfd837a6b0806c57b",
    project: "65a6bee7cba0de3c2ff9bf00",
  }),
];
