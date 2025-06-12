import express from 'express';
import { login, signup, logout} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { signup,login,logout,getUserByEmail } from '../controllers/auth.controller.js';
const router = express.Router();

router.post("/signup",signup);
router.post('/login', login);
router.post('/logout',logout);

router.post("/getUserByEmail",getUserByEmail);
router.get('/private', protect, (req, res) => {
  res.json({ message: 'This is protected data.', userId: req.user.userId });
});

export default router;