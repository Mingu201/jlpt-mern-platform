import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import { ENV } from '../config/env.js';

const generateToken = (id) => {
  return jwt.sign({ id }, ENV.JWT_SECRET, {
    expiresIn: ENV.JWT_EXPIRES_IN
  });
};

const registerSchema = z.object({
  name: z.string().min(2, 'Tên người dùng phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  targetLevel: z.enum(['N5', 'N4', 'N3']).optional()
});

const loginSchema = z.object({
  email: z.string().email('Email không đúng định dạng'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu')
});

// @desc    Đăng ký tài khoản
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0].message
      });
    }

    const { name, email, password, targetLevel = 'N5' } = parsed.data;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Email này đã được sử dụng. Vui lòng chọn email khác.'
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      targetLevel,
      streak: 1,
      lastActiveDate: new Date()
    });

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        targetLevel: user.targetLevel,
        streak: user.streak
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Đăng nhập
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.errors[0].message
      });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email hoặc mật khẩu không chính xác.'
      });
    }

    // Cập nhật chuỗi Streak theo ngày
    const now = new Date();
    if (user.lastActiveDate) {
      const diffDays = Math.floor((now - new Date(user.lastActiveDate)) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
    } else {
      user.streak = 1;
    }
    user.lastActiveDate = now;
    await user.save();

    const token = generateToken(user._id);

    res.cookie('token', token, {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        targetLevel: user.targetLevel,
        streak: user.streak
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Lấy thông tin người dùng hiện tại
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
};
