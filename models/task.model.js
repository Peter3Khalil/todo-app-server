const mongoose = require("mongoose");
const taskSchema = new mongoose.Schema({
   name: {
    type: String,
    required: true,
   },
    description: {
        type: String,
        default: "",
    },
    status: {
        type: String,
        enum: ["todo", "inprogress", "done"],
        default: "todo",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    deadline: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low",
    },
    
});
const Task = mongoose.model("Task", taskSchema);
module.exports = Task;