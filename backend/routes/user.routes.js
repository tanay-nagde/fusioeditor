// routes/user.routes.js

import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser
} from '../controller/user.controller.js'
import  verifyJWT  from '../middleware/auth.middleware.js'; // assumed middleware for protected routes

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyJWT, logoutUser);
router.post('/refresh-token', refreshAccessToken);
router.get('/me', verifyJWT, getCurrentUser);

export default router;
