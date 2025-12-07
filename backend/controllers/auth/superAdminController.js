// backend/controllers/auth/superAdminController.js

const bcrypt = require("bcryptjs");
const User = require("../../models/user.modal");           // filename ke hisaab se
const generateToken = require("../../services/generateToken");

// ------------- SEED SUPERADMIN (run once) -------------
exports.seedSuperAdmin = async (req, res) => {
  try {
    const existing = await User.findOne({ role: "superadmin" });

    if (existing) {
      return res.status(200).json({ message: "SuperAdmin already exists" });
    }

    const passwordHash = await bcrypt.hash("superadmin123", 10); // default password

    const superAdmin = await User.create({
      name: "Super Admin",
      email: "superadmin@cosmos.com",
      passwordHash,
      role: "superadmin",
    });

    return res.status(201).json({
      message: "SuperAdmin created",
      user: {
        id: superAdmin._id,
        email: superAdmin.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Seeding superadmin failed" });
  }
};

// ------------- SUPERADMIN LOGIN -------------
exports.superAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.role !== "superadmin") {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    return res.json({
      message: "SuperAdmin Logged In",
      token,
      user: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};
