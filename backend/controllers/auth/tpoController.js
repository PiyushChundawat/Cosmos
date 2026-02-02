// controllers/auth/tpoController.js
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const College = require("../../models/College.model");
const User = require("../../models/user.model");
const generateToken = require("../../services/generateToken");
const Razorpay = require('razorpay');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// helper to create random codes
const generateCode = () => crypto.randomBytes(4).toString("hex");

// CREATE RAZORPAY ORDER
exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount should be 20000
    
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `tpo_receipt_${Date.now()}`,
      notes: {
        description: 'TPO College Registration Payment'
      }
    };

    const order = await razorpay.orders.create(options);
    
    res.json({
      success: true,
      order: order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// TPO SIGNUP (Modified to include payment verification)
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
      // Payment details
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    // VERIFY PAYMENT SIGNATURE
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ 
        message: "Invalid payment signature. Payment verification failed." 
      });
    }

    // Payment verified, proceed with signup
    const existingCollege = await College.findOne({ name: collegeName });
    if (existingCollege) {
      return res.status(400).json({ message: "College already exists" });
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
        plan: "annual",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
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

    const token = generateToken(tpoUser);

    res.status(201).json({
      message: "College & TPO registered successfully",
      token,
      studentCode: college.studentCode,
      facultyCode: college.facultyCode,
      college: {
        id: college._id,
        name: college.name,
        emailDomain: college.emailDomain,
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

// TPO LOGIN (unchanged)
exports.tpoLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("college");
    if (!user || !["collegeadmin", "tpo"].includes(user.role)) {
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
        collegeName: user.college?.name,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};