import { NextFunction, Request, Response } from 'express';
import UserService from './user.service';
import { AuthenticatedRequest } from '../common/middlewares/auth';

class UserController {
  async findAllUsers(req: Request, res: Response) {
    const { userName } = req.query as { userName: string };

    try {
      const users = await UserService.findAll(userName);
      res.status(201).json({ users });
    } catch (error) {
      let errorMessage = 'Server Error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      res.status(500).json({ message: errorMessage });
    }
  }
}

export default new UserController();
