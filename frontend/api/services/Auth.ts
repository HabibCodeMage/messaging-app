import ApiBase from '../common/ApiBase';

export default class Auth extends ApiBase {
  async login(userName: string, password: string) {
    return this.axios.post('/auth/login', { userName, password });
  }
  async signUp(userName: string, password: string) {
    return this.axios.post('/auth/signUp', { userName, password });
  }

  async getUser() {
    return this.axios.get('/auth');
  }
}
