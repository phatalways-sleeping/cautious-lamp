const mongoose = require("mongoose");
const slug = require("slug");

const taskSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "A task must have a creator"],
    },
    scheduledDate: {
      type: mongoose.SchemaTypes.Date,
      validate: {
        validator(val) {
          return val <= this.dueDate;
        },
        message: "Scheduled date must be before due date",
      },
    },
    category: {
      type: mongoose.SchemaTypes.String,
      required: [true, "A task must have a category"],
    },
    notes: mongoose.SchemaTypes.String,
    steps: [
      {
        title: {
          type: mongoose.SchemaTypes.String,
          required: [true, "A step must have a title"],
          minlength: [10, "A step's title must be at least 10 characters"],
          maxlength: [100, "A step's title must be at most 100 characters"],
          trim: true,
        },
        description: mongoose.SchemaTypes.String,
        notes: mongoose.SchemaTypes.String,
        isCompleted: {
          type: mongoose.SchemaTypes.Boolean,
          default: false,
        },
      },
    ],
    completion: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
      min: [0, "Completion must be from 0"],
      max: [100, "Completion must be at most 100"],
    },
    attachments: [mongoose.SchemaTypes.String],
    title: {
      type: mongoose.SchemaTypes.String,
      required: [true, "A task must have a title"],
      minlength: [10, "A task name must be greater or equal to 10 characters"],
      maxlength: [
        100,
        "A task name must be smaller or equal to 100 characters",
      ],
      trim: true,
      unique: true,
    },
    priority: {
      type: mongoose.SchemaTypes.String,
      default: "low",
      enum: {
        values: ["low", "medium", "high", "urgent"],
        message: "Priority must be either low, medium, high, or urgent",
      },
    },
    status: {
      type: mongoose.SchemaTypes.String,
      enum: {
        values: ["not-started", "in-progress", "done"],
        message:
          "A task status must be either not-started, in-progress, or done",
      },
      default: "not-started",
    },
    description: {
      type: mongoose.SchemaTypes.String,
      trim: true,
    },
    dateCompleted: mongoose.SchemaTypes.Date,
    dueDate: {
      type: mongoose.SchemaTypes.Date,
      require: [true, "A task must have a due date"],
    },
    slug: mongoose.SchemaTypes.String,
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // Hide this attribute from the client
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
    discriminatorKey: "kind",
  }
);

// Indexing
// Search for task name
taskSchema.index({
  slug: 1,
});
// Search for category and priority
taskSchema.index({
  category: 1,
  priority: -1,
});

// Middlewares
taskSchema.pre("save", function (next) {
  this.slug = slug(this.title, {
    lower: true,
  });
  next();
});

taskSchema.pre("save", function (next) {
  if (!this.isModified("steps") || !this.isNew) return next();
  if (this.steps === undefined) this.completion = 0.0;
  else {
    this.completion = Math.round(
      (this.steps.reduce((prev, curr, _) => {
        if (curr.isCompleted) return prev + 1;
        return prev;
      }, 0) *
        100 *
        1.0) /
        (this.steps.length * 1.0)
    );
  }
  return next();
});

taskSchema.pre(/^find/, function (next) {
  this.find({
    isDeleted: {
      $ne: true,
    },
  });
  return next();
});

taskSchema.pre(/^find/, function (next) {
  this.select("-__v");
  return next();
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "creator",
    select: "email -__v",
  });
  return next();
});

taskSchema.virtual("late").get(function () {
  if (this.status === "done" || this.completion === 100) return false;
  return this.dueDate > Date.now();
});

const Task = mongoose.model("Task", taskSchema);

const ThemeTask = Task.discriminator(
  "ThemeTask",
  new mongoose.Schema(
    {
      assignee: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
      theme: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Theme",
        required: [true, "A theme's task must have theme's id"],
      },
    },
    { discriminatorKey: "kind" }
  )
);

const ProjectTask = Task.discriminator(
  "ProjectTask",
  new mongoose.Schema(
    {
      assignee: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
      project: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Project",
        required: [true, "A project's task must have theme's id"],
      },
    },
    { discriminatorKey: "kind" }
  )
);

module.exports = {
  Task,
  ThemeTask,
  ProjectTask,
};
