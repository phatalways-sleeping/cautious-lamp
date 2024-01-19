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

// Normal
// Create
router.post("/", projectController.createOne);

// Read
router.get("/", projectController.getAll);

// Merged routes
router.use(
  "/:projectId/themes",
  projectController.restrictAccessViaProject,
  themeRoutes
);

router.use(
  "/:projectId/tasks",
  projectController.restrictAccessViaProject,
  taskRoutes
);

router.get("/:projectId", projectController.getOne);

// Update
router.put("/:projectId", projectController.updateOne);

router.patch("/:projectId/colaborators", projectController.updateMembers);

// Delete
router.delete("/:projectId", projectController.deleteProject);

module.exports = router;
