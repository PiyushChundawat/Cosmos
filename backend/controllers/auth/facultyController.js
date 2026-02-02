const bcrypt = require("bcryptjs");
const College = require("../../models/College.model");
const User = require("../../models/user.model");
const generateToken = require("../../services/generateToken");

// FACULTY SIGNUP
exports.facultySignup = async (req, res) => {
  try {
    const { name, email, password, facultyCode, facultyId, department } =
      req.body;

    const college = await College.findOne({ facultyCode });
    if (!college) {
      return res.status(400).json({ message: "Invalid faculty code" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already used" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const faculty = await User.create({
      name,
      email,
      passwordHash,
      role: "faculty",
      college: college._id,
      department,
      facultyId,
    });

    res.status(201).json({
      message: "Faculty registered successfully",
      user: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        role: faculty.role,
        college: college.name,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Faculty signup failed" });
  }
};

// FACULTY LOGIN
exports.facultyLogin = async (req, res) => {
  try {
    const { email, password, facultyCode } = req.body;

    const user = await User.findOne({ email }).populate("college");
    if (!user || user.role !== "faculty") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Incorrect password" });

    if (user.college.facultyCode !== facultyCode) {
      return res.status(400).json({ message: "Invalid faculty code" });
    }

    const token = generateToken(user);

    return res.json({
      message: "Faculty Login Successful",
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