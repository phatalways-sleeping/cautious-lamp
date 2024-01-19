const express = require("express");

// Controllers
const tasksController = require("../controllers/taskController");
const authController = require("../controllers/authController");
//

const router = express.Router({
  mergeParams: true,
});

router.use(authController.protect);

router.use(tasksController.assignModel);

// Alias routes
// Nearest tasks
router.get(
  "/top-5-nearest",
  tasksController.setUpTop5NearestTasks,
  tasksController.getAll
);
// Get today's tasks
router.get("/today", tasksController.setUpTodayTasks, tasksController.getAll);
// Mark a tasks as complete or incomplete (toggle)
router.get(
  "/:id/mark-complete",
  tasksController.setUpTaskCompletion("done"),
  tasksController.updateOne
);
router.get(
  "/:id/mark-incomplete",
  tasksController.setUpTaskCompletion("in-progress"),
  tasksController.updateOne
);
// Normal
// Create
router.post(
  "/",
  tasksController.setUpCreatorId,
  tasksController.setUpAssigneeId,
  tasksController.createOne
);
// Read
router.get("/", tasksController.setUpUserId, tasksController.getAll);
router.get("/:id", tasksController.getOne);
// Update
router.put("/:id", tasksController.restrictsFields, tasksController.updateOne);
// Delete
router.delete("/:id", tasksController.deleteOne);

module.exports = router;
