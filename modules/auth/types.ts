export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  profileImage?: string;
}


export interface AuthResponse {
  success: boolean;
  message: string;
  data: User & {
    token: string;
  };
}
