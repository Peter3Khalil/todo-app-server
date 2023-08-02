const Task = require("../models/task.model.js");
const createTask = async (req, res) => {
  const { id } = req.user;
  const { name, description,priority = "low",
     status = "todo",deadline = Date.now()} = req.body;
  try {
    const task = new Task({
      name,
      description,
      status,
      createdBy:id,
      deadline,
      priority,
    });
    await task.save();
    return res.json({task: {...task._doc,__v:undefined}});
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};
const getUserTasks = async (req, res) => {
  const { id } = req.user;
  try {
    const tasks  = await Task.find({ createdBy: id }).select("-__v");
    return res.json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occured while fetching tasks, try again" });
  }
};
const updateUserTask = async (req, res) => {
  const { id } = req.user;
  const { taskId } = req.params;
  try {
    const task = await Task.findOneAndUpdate({ _id: taskId, createdBy: id }, req.body, {new: true});
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    await task.save();
    return res.json({message: "Task updated successfully", task});
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occured while update task, try again" });
  }
}

const deleteUserTask = async (req, res) => {
  const { id } = req.user;
  const { taskId } = req.params;
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, createdBy: id });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.json({message: "Task deleted successfully", task:{...task._doc,__v:undefined}});
  }catch (error) {
    res
      .status(500)
      .json({ error: "Error occured while deleting task, try again" });
  }
}

module.exports = { createTask, getUserTasks, updateUserTask,deleteUserTask };
