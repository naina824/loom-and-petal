import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_crochet_artisan_jwt_key_2026_secured');

      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) {
        return res.status(401).json({ message: 'Not authorized: Admin not found' });
      }

      req.admin = admin;
      next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized: Token invalid or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized: No token provided' });
  }
};
