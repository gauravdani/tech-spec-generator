import axios from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

export const authService = {
  async login(credentials: LoginCredentials) {
    const response = await axios.post('/api/auth/login', credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  },

  async register(data: RegisterData) {
    const response = await axios.post('/api/auth/register', data);
    const { token } = response.data;
    localStorage.setItem('token', token);
    return response.data;
  },

  async logout() {
    localStorage.removeItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
}; 