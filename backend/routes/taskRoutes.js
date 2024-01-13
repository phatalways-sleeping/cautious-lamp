const express = require("express");

// Controllers
const tasksController = require('../controllers/taskController');
//

const router = express.Router();

// Merged routes

// Alias routes

// Normal
// Create

// Read
router.get('/', tasksController.getAll);
router.get('/:id', tasksController.getOne);

// Update

// Delete

module.exports = router;
