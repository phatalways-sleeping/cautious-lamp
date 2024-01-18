const express = require("express");

const themeController = require("../controllers/themeController");

const router = express.Router();

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
