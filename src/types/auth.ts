export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData extends LoginFormData {
  confirmPassword: string;
  username: string;
}

export type AuthMode = 'login' | 'register';
