export interface User {
  userId: number;
  username: string;
  passwordHash: string;
  role: 'Admin' | 'HR' | 'Manager' | 'Employee';
  employeeId: number;
  isActive: boolean;
  createdAt: string; // ISO datetime
}
