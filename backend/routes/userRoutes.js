const express = require("express");

// Controllers
const userController = require("../controllers/userController");
//

const router = express.Router();

// Alias routes

// Normal
router.get("/", userController.getAll);
router.get("/:id", userController.getOne);

module.exports = router;
