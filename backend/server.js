const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

const adminRoutes = require("./routes/admin.routes");
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));