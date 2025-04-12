const express = require("express");
const cors = require("cors");
const cookieparser = require("cookie-parser");
require("dotenv").config();
const connectdb = require("./config/db");
const authroutes = require("./routes/authRoutes");
const app = express();
app.use(express.json());
app.use(cors({}));
app.options("*", cors());
app.use(cookieparser());

connectdb();

app.get("/", (req, res) => {
  res.send("BACKEND is running");
});
app.use("/api/auth", authroutes);

app.listen(5000, () => console.log("server is running on port 5000"));
