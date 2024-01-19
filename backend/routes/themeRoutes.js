const express = require("express");

const themeController = require("../controllers/themeController");
const authController = require("../controllers/authController");

const taskRoutes = require("./taskRoutes");

const router = express.Router();

// Protect
router.use(authController.protect);

router.use("/:themeId/tasks", taskRoutes);

// Create
router.post("/", themeController.createOne);

// Read
router.get("/", themeController.getAll);

router.get("/:themeId", themeController.getOne);

// Update
router.put("/:themeId", themeController.updateOne);

// Delete
router.delete("/:themeId", themeController.deleteOne);

module.exports = router;
