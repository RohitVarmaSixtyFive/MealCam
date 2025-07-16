const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin: string;
  };
}

export interface SignupRequest {
  name: string;        
  email: string;
  password: string;
  role?: string;       
}

export interface SignupResponse {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    lastLogin: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
  _id: string;
  username: string; // Assuming username is part of the user object
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  },  

  async loginWithGoogle(idToken: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });
    // console.log('Google login response:', response);
  
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Google login failed');
    }
  
    return data;
  },

  async logout(): Promise<void> {
    // Clear local storage or perform any necessary cleanup
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  async signup(credentials: SignupRequest): Promise<SignupResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    return data;
  },
};