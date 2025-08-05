import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import Session from '../models/session.js';
import User from '../models/user.js';

const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'Not authorized'));
  }

  const token = authHeader.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(createHttpError(401, 'Invalid or expired access token'));
  }

  const session = await Session.findOne({ accessToken: token });
  if (!session || session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(payload.userId);
  if (!user) {
    return next(createHttpError(401, 'User not found'));
  }

  req.user = user;
  next();
};

export default authenticate;
