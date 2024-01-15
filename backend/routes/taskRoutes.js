const express = require("express");

// Controllers
const tasksController = require("../controllers/taskController");
const authController = require("../controllers/authController");
//

const router = express.Router({
  mergeParams: true,
});

router.use(authController.protect);
// Alias routes
// Nearest tasks
router.get(
  "/top-5-nearest",
  tasksController.setUpTop5NearestTasks,
  tasksController.getAll
);
router.get("/today", tasksController.setUpTodayTasks, tasksController.getAll);
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
router.put(
  "/:id",
  tasksController.restrictsFields,
  tasksController.updateOne
);
// Delete
router.delete("/:id", tasksController.deleteOne);

module.exports = router;
