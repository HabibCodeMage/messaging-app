import express from 'express';
import authController from '../../../auth/auth.controller';
import authMiddleware from '../../middlewares/auth';

const router = express.Router();

router.post('/signup', authController.signup.bind(authController));
router.post('/login', authController.login.bind(authController));
router.get('/', authMiddleware, authController.getUser.bind(authController));

export default router;
