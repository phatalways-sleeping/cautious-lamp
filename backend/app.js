const express = require("express");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const AppError = require("./utils/appError");
const globalErrorHandler = require('./controllers/errorController');

// Routes
const taskRouter = require('./routes/taskRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Global middlewares
/// Serving static files
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());

if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

// Rate-limit to limit requests from a single IP
// during a span of time
// Avoid brute-force attacks and denial of services
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// Body parser, and limit amount of data sent to the server
app.use(
  express.json({
    limit: "10kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10kb",
  })
);

app.use(cookieParser());

// Data sanitization against NoSQL Query injection
app.use(mongoSanitize());
// Against XSS

// Paramters pollution
app.use(
  hpp({
    whitelist: [
      // Later I will pass some query variables here
    ],
  })
);

app.use((req, _, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.get("/", (_, res) => {
  res.send("Hello World!");
});

// Routes
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);

// Errors
app.use("*", (req, _, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} in the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
