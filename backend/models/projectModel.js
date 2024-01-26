const mongoose = require("mongoose");

const { ProjectTask } = require("./taskModel");

// A project contains multiple themes and multiple tasks
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: mongoose.SchemaTypes.String,
      required: [true, "A project must have a title"],
      minLength: [10, "A project's title must be at least 10 characters"],
      trim: true,
    },
    description: {
      type: mongoose.SchemaTypes.String,
      maxLength: [
        300,
        "A project's description must be at most 300 characters",
      ],
    },
    manager: {
      type: mongoose.SchemaTypes.ObjectId,
      required: [true, "A project must have one manager"],
      ref: "User",
    },
    colaborators: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          ref: "User",
        },
      ],
      validate: {
        validator(val) {
          return val.length >= 1 && val.indexOf(this.manager) !== -1;
        },
        message: "Project's colaborators must have a least the manager",
      },
    },
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    complete: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    createdAt: {
      type: mongoose.SchemaTypes.Date,
      default: Date.now(),
    },
    isDeleted: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
      select: false,
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

// Indexes
projectSchema.index({
  manager: 1,
  title: 1,
});

// Virtuals
projectSchema.virtual("tasks", {
  ref: "ProjectTask",
  localField: "_id",
  foreignField: "project",
  options: {
    sort: {
      createdAt: -1,
    },
  },
});

// Middlewares
projectSchema.pre(/^find/, function (next) {
  this.find({
    isDeleted: {
      $ne: true,
    },
  });
  next();
});

projectSchema.pre(/^find/, function (next) {
  this.select("-__v");
  next();
});

// projectSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "colaborators",
//     select: "email",
//   });
//   next();
// });

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
