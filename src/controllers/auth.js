import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import User from '../models/user.js';
import Session from '../models/session.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const ACCESS_EXPIRES_MIN = 15;
const REFRESH_EXPIRES_DAYS = 30;

const signAccess = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: `${ACCESS_EXPIRES_MIN}m` });

const signRefresh = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: `${REFRESH_EXPIRES_DAYS}d` });

// POST /auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw createHttpError(409, 'Email in use');

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });

    // одразу створювати сесію для register не обовʼязково;
    // але якщо залишаєте — узгодьте payload з authenticate:
    const accessToken = signAccess({ userId: user._id.toString() });
    const refreshToken = signRefresh({ userId: user._id.toString() });

    const now = Date.now();
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(now + ACCESS_EXPIRES_MIN * 60 * 1000),
      refreshTokenValidUntil: new Date(now + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    });

    // Формат для register не регламентували, але можна залишити 201
    return res.status(201).json({
      status: 201,
      message: 'Successfully registered an user!',
      data: { accessToken, user: { id: user._id, name: user.name, email: user.email } },
    });
  } catch (err) {
    if (err?.code === 11000) return next(createHttpError(409, 'Email in use'));
    next(err);
  }
};

// POST /auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw createHttpError(401, 'Email or password is wrong');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw createHttpError(401, 'Email or password is wrong');

    const accessToken = signAccess({ userId: user._id.toString() });
    const refreshToken = signRefresh({ userId: user._id.toString() });

    // одна активна сесія на користувача (якщо це ваша політика)
    await Session.deleteMany({ userId: user._id });

    const now = Date.now();
    await Session.create({
      userId: user._id,
      accessToken,
      refreshToken,
      accessTokenValidUntil: new Date(now + ACCESS_EXPIRES_MIN * 60 * 1000),
      refreshTokenValidUntil: new Date(now + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000),
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/refresh
export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) throw createHttpError(401, 'Refresh token not provided');

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET);
    } catch {
      throw createHttpError(401, 'Refresh token expired');
    }

    const session = await Session.findOne({ refreshToken, userId: payload.userId });
    if (!session) throw createHttpError(401, 'Refresh token expired');

    if (session.refreshTokenValidUntil < new Date()) {
      await Session.findByIdAndDelete(session._id);
      throw createHttpError(401, 'Refresh token expired');
    }

    const accessToken = signAccess({ userId: payload.userId });
    const accessTokenValidUntil = new Date(Date.now() + ACCESS_EXPIRES_MIN * 60 * 1000);

    await Session.findByIdAndUpdate(session._id, { accessToken, accessTokenValidUntil });

    return res.status(200).json({
      status: 200,
      message: 'Successfully refreshed an access token!',
      data: { accessToken },
    });
  } catch (err) {
    next(err);
  }
};

// POST /auth/logout
export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshToken) throw createHttpError(401, 'Session not found');

    let payload;
    try {
      payload = jwt.verify(refreshToken, JWT_SECRET);
    } catch {
      // не валимо сервер при повторному логауті
      return next(createHttpError(401, 'Session not found'));
    }

    const session = await Session.findOne({ refreshToken, userId: payload.userId });
    if (!session) throw createHttpError(401, 'Session not found');

    await Session.findByIdAndDelete(session._id);

    res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'None' });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};
