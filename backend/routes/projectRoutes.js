const express = require("express");

const themeRoutes = require("./themeRoutes");
const taskRoutes = require("./taskRoutes");
const authController = require("../controllers/authController");
const projectController = require("../controllers/projectController");

const router = express.Router({
  mergeParams: true,
});

// Protect
router.use(authController.protect);

// Merged routes
router.use("/:projectId/themes", themeRoutes);
router.use("/:projectId/tasks", taskRoutes);

// Normal
// Create
router.post("/", projectController.createOne);
// Read
router.get("/", projectController.getAll);

router.use("/:projectId", projectController.restrict("colaborator")); // Restrict to project's members

router.get("/:projectId", projectController.getOne);

router.patch("/:projectId/add-tasks", projectController.addTasks);

router.patch("/:projectId/remove-tasks", projectController.deleteTasks);

router.patch("/:projectId/move-task", projectController.moveTask);

router.use("/:projectId", projectController.restrict("manager")); // Restrict to manager only
// Update
router.put("/:projectId", projectController.updateOne);

router.patch("/:projectId/add-members", projectController.addColaborators);

router.patch(
  "/:projectId/remove-members",
  projectController.removeColaborators
);

// Delete
router.delete("/:projectId", projectController.deleteProject);

module.exports = router;
