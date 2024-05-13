require("dotenv").config();

const {default: mongoose} = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static("public"));

// auth route
const authRoute = require("./routes/auth_route");
app.use("/auth", authRoute);

// admin route
const adminRoute = require("./routes/admin_route");
app.use("/auth/admin", adminRoute);

// app route
const appRoute = require("./routes/app_route");
app.use("/api", appRoute);

const port = process.env.SERVER_PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
