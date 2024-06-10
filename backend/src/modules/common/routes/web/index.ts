import express from 'express'
const router = express.Router()

// Import individual web route files
import loginRoute from './login'
import signupRoute from './signup'

// Use the imported route files
router.use('/login', loginRoute)
router.use('/signup', signupRoute)

export default router

