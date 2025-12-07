const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const College = require("../../models/College.model");
const User = require("../../models/user.model");
const generateToken = require("../../services/generateToken");

// helper to create random codes
const generateCode = () => crypto.randomBytes(4).toString("hex");

// TPO SIGNUP
exports.tpoSignup = async (req, res) => {
  try {
    const {
      collegeName,
      collegeEmailDomain,
      tpoName,
      tpoEmail,
      tpoPhone,
      address,
      amount,
      password,
    } = req.body;

    const existingCollege = await College.findOne({ name: collegeName });
    if (existingCollege) {
      return res.status(400).json({ message: "College already exists" });
    }

    const emailDomain = tpoEmail.split("@")[1];
    if (emailDomain !== collegeEmailDomain) {
      return res
        .status(400)
        .json({ message: "TPO email does not match college email domain" });
    }

    const studentCode = generateCode();
    const facultyCode = generateCode();
    const now = new Date();

    const college = await College.create({
      name: collegeName,
      emailDomain: collegeEmailDomain,
      tpoName,
      tpoEmail,
      tpoPhone,
      address,
      studentCode,
      facultyCode,
      subscription: {
        amountPaid: amount,
        plan: "dummy",
        startedAt: now,
        expiresAt: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
    });

    const passwordHash = await bcrypt.hash(password, 10);

    const tpoUser = await User.create({
      name: tpoName,
      email: tpoEmail,
      passwordHash,
      role: "collegeadmin",
      college: college._id,
    });

    res.status(201).json({
      message: "College & TPO registered successfully",
      college: {
        id: college._id,
        name: college.name,
        emailDomain: college.emailDomain,
        studentCode: college.studentCode,
        facultyCode: college.facultyCode,
      },
      tpo: {
        id: tpoUser._id,
        name: tpoUser.name,
        email: tpoUser.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "TPO signup failed" });
  }
};

// TPO LOGIN
exports.tpoLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("college");
    if (!user || user.role !== "collegeadmin") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Incorrect password" });

    const token = generateToken(user);

    return res.json({
      message: "TPO Login Successful",
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