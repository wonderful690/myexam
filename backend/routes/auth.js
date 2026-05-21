const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const {
  generateTokenAndSetCookie,
  clearCookie,
  protect,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/register",
  [
    body("username")
      .matches(/^[a-zA-Z0-9]{6,}$/)
      .withMessage("Неверный формат логина"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Пароль минимум 8 символов"),
    body("fullName").notEmpty().withMessage("ФИО обязательно"),
    body("phone").notEmpty().withMessage("Телефон обязателен"),
    body("email").isEmail().withMessage("Некорректный email"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, password, fullName, phone, email } = req.body;

      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Пользователь с таким логином уже существует" });
      }

      const user = await User.create({
        username,
        password,
        fullName,
        phone,
        email,
      });

      generateTokenAndSetCookie(res, user._id);

      res.status(201).json({
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "Admin26" && password === "Demo20") {
      let admin = await User.findOne({ username: "Admin26" });
      if (!admin) {
        admin = await User.create({
          username: "Admin26",
          password: "Demo20",
          fullName: "Администратор",
          phone: "+70000000000",
          email: "admin@conference.ru",
          role: "admin",
        });
      } else {
        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
          return res.status(401).json({ message: "Неверный логин или пароль" });
        }
      }

      generateTokenAndSetCookie(res, admin._id);

      return res.json({
        user: {
          id: admin._id,
          username: admin.username,
          fullName: admin.fullName,
          role: "admin",
        },
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    generateTokenAndSetCookie(res, user._id);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/logout", (req, res) => {
  clearCookie(res);
  res.json({ message: "Успешный выход из системы" });
});

router.get("/me", protect, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      username: req.user.username,
      fullName: req.user.fullName,
      role: req.user.role,
    },
  });
});

module.exports = router;
