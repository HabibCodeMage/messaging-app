import User, { IUser } from '../common/models/User';

class UserService {
  async findAll(userName: string): Promise<IUser[]> {
    const users = await User.find({ name: { $ne: userName } }).lean();
    return users as IUser[];
  }
}

export default new UserService();
