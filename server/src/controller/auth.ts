import { Request, Response } from 'express';
import User from '../models/user';
import jwt from 'jsonwebtoken';

export const auth = {
  register: async (req: Request, res: Response): Promise<void> => {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: 'Missing email and/or password' });
      return;
    }

    try {
      const user = await User.findOne({ email });
      if (user) {
        res
          .status(400)
          .json({ success: false, message: 'The user already exists' });
        return;
      }

      const newUser = await User.create({
        name,
        email,
        password,
      });

      // return token
      const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET!,
        { expiresIn: '7h' }
      );

      res.status(200).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'An error occurred in creating the user',
      });
    }
  },
  login: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .json({ success: false, message: 'Missing email and/or password' });
      return;
    }

    try {
      const user = await User.findOne({ email });
      if (!user || !(await user.comparePassword(password))) {
        res
          .status(401)
          .json({ success: false, message: 'Incorrect email or password' });
        return;
      }

      // return token
      const accessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      const refreshToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      );

      // Set refreshToken in httpOnly cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Chỉ bật secure khi chạy production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      });

      res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
          accessToken,
          refreshToken,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Invalid credentials',
      });
    }
  },
};
