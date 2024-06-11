import jwt from 'jsonwebtoken';
import User from '../common/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

class AuthService {
  async signup(userName: string, password: string): Promise<string> {
    // Check if user already exists
    let user = await User.findOne({ name: userName });
    if (user) throw new Error('User already exists');

    // Create new user
    user = new User({ name: userName, password });
    await user.save();

    // Create and return JWT
    return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  }

  async login(userName: string, password: string): Promise<string> {
    // Check if user exists
    const user = await User.findOne({ name: userName });
    if (!user) throw new Error('Invalid credentials');

    // Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    // Create and return JWT
    return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
  }
}

export default new AuthService();
