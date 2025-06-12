import express from 'express';
import { login, signup, logout} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.post("/signup",signup);
router.post('/login', login);
router.post('/logout',logout);

router.get('/private', protect, (req, res) => {
  res.json({ message: 'This is protected data.', userId: req.user.userId });
});

export default router;