const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = process.env.PORT || 3000;
const dotenv = require("dotenv");
const { default: helmet } = require("helmet");
const userRoutes = require("./routes/user.routes.js");
const taskRoutes = require("./routes/task.routes.js");
dotenv.config();
app.use(express.json());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(process.env.MONGODB_URL_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.log(err));
app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);
//error midleware
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ message: "something went wrong"});
})
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
