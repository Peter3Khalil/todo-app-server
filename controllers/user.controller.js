const User = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../utils/sendEmailVerification.js");
const generateVerificationToken = () => {
  return require("crypto").randomBytes(32).toString("hex");
};
let notVerifiedUsers = [];
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const isUserExists = (await User.findOne({ email })) ? true : false;
    if (isUserExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({
      name,
      email,
      password,
    });
    const salt = bcrypt.genSaltSync(10);
    user.password = bcrypt.hashSync(
      password + process.env.BCRYPT_SECRET_STRING,
      salt
    );
    const savedUser = await user.save();
    //Todo:handle email verification
    const verificationToken = generateVerificationToken();
    notVerifiedUsers.push({ email, verificationToken });
    sendVerificationEmail(email, verificationToken);
    res.status(201).json({
      message: "User created successfully",
      user: { ...savedUser._doc, password: undefined, __v: undefined },
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "email or password is incorrect" });
    }
    const isPasswordCorrect = bcrypt.compareSync(
      password + process.env.BCRYPT_SECRET_STRING,
      user.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(404)
        .json({ message: "email or password is incorrect" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_STRING);
    res.status(200).json({ message: "User logged in successfully", token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
async function getUser(req, res) {
  const { id } = req.user;
  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = await User.findById(id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function deleteAccount(req, res) {
  const { id } = req.user;
  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}
async function updateUser(req, res) {
  const { id } = req.user;
  if (!id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    //check if user exists
    let user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if this id is the same as the id in datebase
    if (id !== user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //check if email is changed or not
    const { email = user.email } = req.body;
    if(email !== user.email){
      //check if email is already exists
      const isEmailExists = (await User.findOne({email}))?true:false;
      if(isEmailExists){
        return res.status(400).json({message:"Email already exists"});
      }
      req.body.isVerified = false;
      const verificationToken = generateVerificationToken();
      notVerifiedUsers.push({ email, verificationToken });
      sendVerificationEmail(email, verificationToken);
    }
    //update user
    user.set(req.body);
    await user.save();
    res.status(200).json({ message: "User updated successfully" ,user});
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}
async function getAllUsers(req, res) {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (user.role !== "admin") {
      return res.status(401).json("Unauthorized");
    }
    const allUsers = await User.find({}).select("-password -__v");
    return res.status(200).json(allUsers);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = notVerifiedUsers.find(
    (user) => user.verificationToken === verificationToken
  );
  try {
    if (!user) {
      return res.status(404).json({ message: "Invalid URL" });
    }
    const { email } = user;
    const verifiedUser = await User.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true }
    );
    await verifiedUser.save();
    notVerifiedUsers = notVerifiedUsers.filter((user) => user.email !== email);
    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//resend verification email
const resendVerificationEmail = async (req, res) => {
  const { id } = req.user;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { email, isVerified } = user;
    if (isVerified) {
      return res
        .status(400)
        .json({ message: "Your account is already verified" });
    }
    const verificationToken = generateVerificationToken();
    notVerifiedUsers.push({ email, verificationToken });
    sendVerificationEmail(email, verificationToken);
    return res.status(200).json({ message: "Verification email sent" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Logout
const logout = async (req, res) => {
  console.log(req.user, req.headers.authorization);
  req.user = null;
  req.headers.authorization = null;
  console.log(req.user, req.headers.authorization);
  res.status(200).json({ message: "User logged out successfully" });
}
module.exports = {
  register,
  login,
  getUser,
  deleteAccount,
  updateUser,
  getAllUsers,
  verifyEmail,
  resendVerificationEmail,
  logout
};
