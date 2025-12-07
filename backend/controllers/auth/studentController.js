const bcrypt = require("bcryptjs");
const College = require("../../models/College.model");
const User = require("../../models/user.model");
const generateToken = require("../../services/generateToken");

// STUDENT SIGNUP
exports.studentSignup = async (req, res) => {
  try {
    const { name, email, password, studentCode, regNo, department } = req.body;

    const college = await College.findOne({ studentCode });
    if (!college) {
      return res.status(400).json({ message: "Invalid student code" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already used" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const student = await User.create({
      name,
      email,
      passwordHash,
      role: "student",
      college: college._id,
      department,
      regNo,
    });

    res.status(201).json({
      message: "Student registered successfully",
      user: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        college: college.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Student signup failed" });
  }
};

// STUDENT LOGIN
exports.studentLogin = async (req, res) => {
  try {
    const { email, password, studentCode } = req.body;

    const user = await User.findOne({ email }).populate("college");
    if (!user || user.role !== "student") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Incorrect password" });

    if (user.college.studentCode !== studentCode) {
      return res.status(400).json({ message: "Invalid student code" });
    }

    const token = generateToken(user);

    return res.json({
      message: "Student Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        college: user.college?.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};