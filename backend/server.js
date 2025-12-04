const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB error:", err));

// Routes
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => console.log(`Server started on PORT: ${port}`));