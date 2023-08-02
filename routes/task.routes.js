const router = require("express").Router();
const taskController = require("../controllers/task.controller.js");
const { authenticateUser } = require("../middlewares/auth.js");
const { validateTaskCreation, validateTaskUpdate } = require("../middlewares/validate.js");
router.post("/", authenticateUser, validateTaskCreation,taskController.createTask);
router.get("/", authenticateUser, taskController.getUserTasks);
router.put("/:taskId", authenticateUser,validateTaskUpdate ,taskController.updateUserTask);
router.delete("/:taskId", authenticateUser, taskController.deleteUserTask);
module.exports = router;