// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";
import generateToken from "../utils/jwt.js";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { fname, lname, email, password } = req.body;

  const userExists = await Admin.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  if (!fname || !lname || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const admin = await Admin.create({
    fname,
    lname,
    email,
    password: hashedPassword,
  });

  res.status(201).json({
    token: generateToken(admin._id),
    admin: { id: admin._id, email: admin.email },
  });
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.json({
    token: generateToken(admin._id),
    admin: { id: admin._id, email: admin.email },
  });
});

export default router;
