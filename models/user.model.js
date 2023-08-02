const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required:true
    },
    role:{
        type:String,
        default:"user",
    },
    preferernces: {
        type: Array,
        default: []
    }
});
const User = mongoose.model("User", userSchema);
module.exports = User;