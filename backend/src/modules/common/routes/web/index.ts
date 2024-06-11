import express from 'express';
const router = express.Router();

// Import individual web route files
import authRoutes from './auth';
import userRoutes from './users';

// Use the imported route files
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
