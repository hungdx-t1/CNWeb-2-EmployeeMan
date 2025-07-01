
export interface Attendance {
  attendanceId: number;
  employeeId: number;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm:ss
  checkOut: string; // HH:mm:ss
  recordedByUserId: number;
}
