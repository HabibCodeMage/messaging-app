import express from 'express';
import authMiddleware from '../../middlewares/auth';
import userController from '../../../user/user.controller';

const router = express.Router();

router.get(
  '/',
  authMiddleware,
  userController.findAllUsers.bind(userController),
);

export default router;
