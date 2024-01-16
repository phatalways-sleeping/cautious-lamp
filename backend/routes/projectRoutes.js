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
router.get("/:projectId", projectController.getOne);
router.get("/", projectController.getAll);

router.use(projectController.restrict); // Restrict to manager only
// Update
router.put("/:projectId", projectController.updateOne);
router.patch("/:projectId/add", projectController.addColaborators);
router.patch("/:projectId/remove", projectController.removeColaborators);

// Delete
router.delete("/:projectId", projectController.deleteProject);

module.exports = router;
