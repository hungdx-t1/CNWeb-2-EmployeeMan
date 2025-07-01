export interface UserLoginRequest {
  username: string;
  password: string;
}

export interface UserLoginResponse {
  userId: number;
  username: string;
  role: 'Admin' | 'HR' | 'Manager' | 'Employee';
  employeeId: number | null;
}
