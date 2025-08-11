import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';

import User from '../models/user.js';
import Session from '../models/session.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const ACCESS_EXPIRES_MIN = 15; // хвилин
const REFRESH_EXPIRES_DAYS = 30; // днів

const signAccess = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: `${ACCESS_EXPIRES_MIN}m` });

const signRefresh = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: `${REFRESH_EXPIRES_DAYS}d` });

// POST /api/auth/register
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    // ВАЖЛИВО: 409 через createHttpError, як вимагалось
    throw createHttpError(409, 'Email in use');
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });

  const accessToken = signAccess({ id: user._id });
  const refreshToken = signRefresh({ id: user._id });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + ACCESS_EXPIRES_MIN * 60 * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  // кука з рефрешем (SameSite=None; Secure — під прод, httpOnly)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// POST /api/auth/login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  const accessToken = signAccess({ id: user._id });
  const refreshToken = signRefresh({ id: user._id });

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + ACCESS_EXPIRES_MIN * 60 * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000);

  // одна активна сесія на користувача (опціонально)
  await Session.deleteMany({ userId: user._id });

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: REFRESH_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    user: { id: user._id, name: user.name, email: user.email },
  });
};

// POST /api/auth/refresh
export const refresh = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token');
  }

  let payload;
  try {
    payload = jwt.verify(refreshToken, JWT_SECRET);
  } catch {
    throw createHttpError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({ refreshToken, userId: payload.id });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    await Session.findByIdAndDelete(session._id);
    throw createHttpError(401, 'Refresh token expired');
  }

  const accessToken = signAccess({ id: payload.id });
  const accessTokenValidUntil = new Date(Date.now() + ACCESS_EXPIRES_MIN * 60 * 1000);

  await Session.findByIdAndUpdate(session._id, { accessToken, accessTokenValidUntil });

  res.json({ accessToken });
};

// POST /api/auth/logout
export const logout = async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  await Session.findByIdAndDelete(session._id);

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });

  res.status(204).end();
};
