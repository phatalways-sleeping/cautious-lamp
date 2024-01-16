const mongoose = require("mongoose");

// A theme groups multiple related tasks
const themeSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "A theme must have a creator"],
    },
    project: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Project",
      required: [true, "A theme must belong to a project"],
    },
    title: {
      type: mongoose.SchemaTypes.String,
      required: [true, "A theme must have a title"],
      minLength: [4, "A theme title must have at least 4 characters"],
      maxLength: [100, "A theme title must have at most 100 characters"],
      trim: true,
    },
    description: {
      type: mongoose.SchemaTypes.String,
      trim: true,
    },
    complete: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    tasks: {
      type: [
        {
          type: mongoose.SchemaTypes.ObjectId,
          required: true,
          ref: "Task",
        },
      ],
      default: [],
    },
    createdAt: {
      type: mongoose.SchemaTypes.Date,
      default: Date.now(),
      select: false,
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

themeSchema.pre(/^find/, function (next) {
  this.find({
    isDeleted: {
      $ne: true,
    },
  });
  next();
});

themeSchema.pre(/^find/, function (next) {
  this.select("-createdAt -__v");
  next();
});

// For finding contributors of the current theme
themeSchema.pre(/^find/, function (next) {
  this.populate({
    path: "tasks",
    select: "creator assignee",
  });
  next();
});

const Theme = mongoose.model("Theme", themeSchema);

module.exports = Theme;
