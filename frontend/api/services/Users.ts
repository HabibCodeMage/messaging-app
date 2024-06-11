import ApiBase from '../common/ApiBase';

export default class Users extends ApiBase {
  async findAll(name: string) {
    return this.axios.get(`/users?userName=${name}`);
  }
}
