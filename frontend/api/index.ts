import axios, { AxiosInstance } from 'axios';
import Auth from './services/Auth';
import Users from './services/Users';

const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

class Api {
  axios: AxiosInstance;
  token: string | undefined;
  auth: Auth;
  users: Users;

  constructor() {
    this.axios = axios.create({
      baseURL: `${BACKEND_BASE_URL}`, // internal api
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.axios.interceptors.request.use((config) => {
      if (this.token) {
        this.axios.defaults.headers.common['Authorization'] =
          `Bearer ${this.token}`;
      }

      return config;
    });

    this.auth = new Auth(this.axios);
    this.users = new Users(this.axios);
  }

  setToken(token: string) {
    this.token = token;
    this.axios.defaults.headers.common['Authorization'] =
      `Bearer ${this.token}`;
  }
}

const api = new Api();
export default api;
