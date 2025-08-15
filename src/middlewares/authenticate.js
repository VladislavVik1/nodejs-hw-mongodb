import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/session.js';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Not authorized'));
  }

  const token = authHeader.slice(7);

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET); // ожидаем payload.userId
  } catch {
    return next(createHttpError(401, 'Not authorized'));
  }

  // Привязка токена к пользователю + проверка TTL
  const session = await Session.findOne({ userId: payload.userId, accessToken: token });
  if (!session || session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Not authorized'));
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    return next(createHttpError(401, 'Not authorized'));
  }

  req.user = user;
  next();
};

export default authenticate;
