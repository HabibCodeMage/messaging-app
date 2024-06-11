import { NextFunction, Request, Response } from 'express';
import AuthService from './auth.service';
import { AuthenticatedRequest } from '../common/middlewares/auth';

class AuthController {
  async signup(req: Request, res: Response) {
    const { userName, password } = req.body || {};

    try {
      const token = await AuthService.signup(userName, password);
      res.status(201).json({ token });
    } catch (error) {
      let errorMessage = 'Server Error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }

  async login(req: Request, res: Response) {
    const { userName, password } = req.body || {};

    try {
      const token = await AuthService.login(userName, password);
      res.json({ token });
    } catch (error) {
      let errorMessage = 'Invalid credentials';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(400).json({ message: errorMessage });
    }
  }

  async getUser(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const user = req.user;

    res.status(200).json({ _id: user?._id, name: user?.name });
  }
}

export default new AuthController();
