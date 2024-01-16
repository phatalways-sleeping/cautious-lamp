const express = require("express");

// Controllers
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const taskRoutes = require("./taskRoutes");
const projectRoutes = require("./projectRoutes");
//
const router = express.Router();

// Merged routes
router.use("/tasks", taskRoutes);
router.use("/projects", projectRoutes);

// Normal
router.post("/login", authController.login);

router.post("/signup", authController.signUp);

router.get("/logout", authController.logout);

router.post("/forgot-password", authController.forgetPassword);

router.patch("/reset-password", authController.resetPassword);

// Protected, the below routes are required being authenticated before accessing
router.use(authController.protect);

router.delete("/deleteMe", authController.deleteMe);

router.patch("/changePassword", authController.updatePassword);

router.get("/me", userController.getMe);

// Restrict
router.use(authController.restrict("admin"));

router.get("/", userController.getAll);

router.get("/:id", userController.getOne);

module.exports = router;
