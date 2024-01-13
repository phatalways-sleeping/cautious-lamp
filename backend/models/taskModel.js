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
          return val >= Date.now();
        },
        message: "Scheduled date must be from today",
      },
    },
    category: {
      type: mongoose.SchemaTypes.String,
      required: [true, "A task must have a category"],
    },
    notes: mongoose.SchemaTypes.String,
    completion: {
      type: mongoose.SchemaTypes.Number,
      default: 0.0,
    },
    attachments: [mongoose.SchemaTypes.String],
    steps: [mongoose.SchemaTypes.String],
    title: {
      type: mongoose.SchemaTypes.String,
      required: [true, "A task must have a title"],
      minLength: [10, "A task name must be greater or equal to 10 characters"],
      maxLength: [
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

taskSchema.pre(/^find/, function (next) {
  this.find({
    isDeleted: {
      $ne: true,
    },
  });
  return next();
});

taskSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "email -__v -passwordChangedAt",
  });
  return next();
});

taskSchema.virtual("late").get(function () {
  return this.dueDate > Date.now();
});

const Task = mongoose.model("Task", taskSchema);

const CooperatedTask = Task.discriminator(
  "CooperatedTask",
  new mongoose.Schema(
    {
      assignee: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "User",
      },
    },
    { discriminatorKey: "kind" }
  )
);

module.exports = {
  Task,
  CooperatedTask,
};
