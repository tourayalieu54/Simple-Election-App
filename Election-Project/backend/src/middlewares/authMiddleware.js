// /middleware/authMiddleware.js
import { AuthService } from '../services/auth.js';

// Auth Middleware
export async function authMiddleware(req, res, next) {
  // Get token from Authorization header
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied, token missing' });
  }

  try {
    const decoded = AuthService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user to the request object
    req.user = decoded;
    next(); // Continue to the next middleware/route
  } catch (error) {
    console.error('JWT authentication error', error);
    res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
}

// Role Authorization Middleware
export function authorizeRole(requiredRoles) {
  return (req, res, next) => {
    try {
      const userRole = req.user?.role;

      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
      }

      next(); // Continue to the next middleware/route
    } catch (error) {
      console.error('Error authorizing user', error);
      res.status(500).json({ message: 'Error authorizing user' });
    }
  };
}
