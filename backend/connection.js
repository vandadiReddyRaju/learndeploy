// mern-auth/server/server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const MONGODB_URI = process.env.MONGODB_URI;

app.use(express.json());
app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));

if (!MONGODB_URI) {
  console.error("❌ Missing MONGODB_URI in .env");
  process.exit(1);
}

// 1) DB connect
await mongoose.connect(MONGODB_URI);
console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);

// 2) User model: email + passwordHash
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true }
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

// 3) Auth routes

// POST /api/auth/signup
app.post("/api/auth/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already registered" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, passwordHash });

    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || "dev_secret", {
      expiresIn: "1d",
    });

    return res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
});

// POST /api/auth/signin
app.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ sub: user._id, email: user.email }, process.env.JWT_SECRET || "dev_secret", {
      expiresIn: "1d",
    });

    return res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Signin failed" });
  }
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState });
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`));
