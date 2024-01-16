const Project = require("../models/projectModel");

module.exports = [
  new Project({
    title: "Do this later",
    description: "A backend project",
    manager: "65a1a85cfd837a6b0806c57b",
    colaborators: ["65a1a85cfd837a6b0806c57b", "65a1a85cfd837a6b0806c579"],
    creator: "65a1a85cfd837a6b0806c57b",
  }),
  new Project({
    title: "SeeVi - A website to explore job's candidates",
    description: "A really big project",
    manager: "65a1a85cfd837a6b0806c57b",
    colaborators: ["65a1a85cfd837a6b0806c57b", "65a1a85cfd837a6b0806c579"],
    creator: "65a1a85cfd837a6b0806c57b",
  }),
];
