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
        validator: (val) => val >= Date.now(),
        message: "Scheduled date must be from today",
      },
    },
    steps: [mongoose.SchemaTypes.String],
    title: {
      type: mongoose.SchemaTypes.String,
      required: [true, "A task must have a title"],
      minLength: [10, "A task name must be greater or equal to 10 characters"],
      maxLength: [40, "A task name must be smaller or equal to 40 characters"],
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

// Document Middlewares: run before .save and .create
taskSchema.pre("save", (next) => {
  this.slug = slug(this.title, {
    lower: true,
  });
  next();
});

taskSchema.virtual("late").get(() => this.dueDate > Date.now());

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
