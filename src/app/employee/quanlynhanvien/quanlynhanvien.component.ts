import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Cần cho *ngFor
import { EmployeeService } from '../../core/services/employee.service';
import { UserService } from '../../core/services/user.service';
import { forkJoin } from 'rxjs'; // Import forkJoin để gọi nhiều API song song
import { FormsModule } from '@angular/forms';

// Định nghĩa Interface cho Employee (Giả định cấu trúc dữ liệu từ API)
export interface Employee {
  employeeId: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // Hoặc Date, tùy thuộc vào định dạng từ API
  // Thêm các thuộc tính khác của nhân viên nếu có
}

// Định nghĩa Interface cho User (Giả định cấu trúc dữ liệu từ API)
export interface User {
  userId: number; // ID duy nhất của người dùng
  employeeId: number; // ID nhân viên, dùng để liên kết với bảng Employee
  username: string; // Tên tài khoản đăng nhập
  // Thêm các thuộc tính khác của người dùng nếu có
}

@Component({
  selector: 'app-quanlynhanvien',
  standalone: true, // Quan trọng: Đảm bảo component là Standalone nếu bạn dùng `imports` trực tiếp
  imports: [CommonModule, FormsModule], // CommonModule cần thiết cho *ngFor
  templateUrl: './quanlynhanvien.component.html',
  styleUrl: './quanlynhanvien.component.css',
})
export class QuanlynhanvienComponent implements OnInit {
  // employees sẽ chứa dữ liệu nhân viên đã được hợp nhất với username
  employees: (Employee & { username?: string; userId?: number })[] = [];
  filteredEmployees: (Employee & { username?: string; userId?: number })[] = [];
  searchId: string = '';

  constructor(
    private employeeApiService: EmployeeService, // Đổi tên biến để rõ ràng hơn
    private userApiService: UserService // Đổi tên biến để rõ ràng hơn
  ) {}

  ngOnInit(): void {
    this.loadEmployeesAndUsers(); // Gọi hàm tải dữ liệu ban đầu
  }

  /**
   * Tải tất cả nhân viên và người dùng, sau đó hợp nhất dữ liệu.
   * Đây là hàm chính để làm mới danh sách sau các thao tác CRUD.
   */
  private loadEmployeesAndUsers(): void {
    forkJoin({
      employees: this.employeeApiService.getAllEmployees(),
      users: this.userApiService.getall(),
    }).subscribe(
      ({ employees, users }) => {
        this.employees = employees.map((emp) => {
          const matchingUser = users.find(
            (user) => user.employeeId === emp.employeeId
          );
          return {
            ...emp,
            username: matchingUser ? matchingUser.username : 'N/A',
            userId: matchingUser ? matchingUser.userId : undefined, // Lấy userId để sử dụng cho thao tác User
          };
        });
      },
      (error) => {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
        // Xử lý lỗi: hiển thị thông báo cho người dùng, v.v.
      }
    );
  }

  performSearch(): void {
    const trimmed = this.searchId.trim();
    if (!trimmed) {
      this.filteredEmployees = [...this.employees];
    } else {
      const id = Number(trimmed);
      if (!isNaN(id)) {
        this.filteredEmployees = this.employees.filter(
          (emp) => emp.employeeId === id
        );  
      } else {
        this.filteredEmployees = [];
      }
    }
  }

  /**
   * Xử lý hành động xóa một nhân viên.
   * @param employeeId ID của nhân viên cần xóa.
   * @param userId (Tùy chọn) ID của tài khoản người dùng liên quan, nếu bạn muốn xóa cả user khi xóa employee.
   */
  onDeleteEmployee(employeeId: number, userId?: number): void {
    if (
      confirm(
        `Bạn có chắc chắn muốn xóa nhân viên ID: ${employeeId} này không?`
      )
    ) {
      this.employeeApiService.deleteEmployee(employeeId).subscribe(
        () => {
          console.log(`Đã xóa nhân viên ID: ${employeeId} thành công.`);
          this.loadEmployeesAndUsers();

          if (userId) {
            this.userApiService.deleteUser(userId).subscribe(
              () => {
                console.log(`Đã xóa tài khoản ID: ${userId} liên quan.`);
              },
              (userError) => {
                console.warn(
                  `Không thể xóa tài khoản ID: ${userId} liên quan:`,
                  userError
                );
                if (userError.status !== 404) {
                  alert(
                    `⚠️ Không thể xóa tài khoản ID: ${userId} liên quan.\nChi tiết: ${
                      userError?.error?.message ||
                      userError?.message ||
                      'Lỗi không xác định'
                    }`
                  );
                } else {
                  console.log(
                    `⚠️ Tài khoản ID: ${userId} không tồn tại, có thể đã bị xóa từ trước.`
                  );
                }
              }
            );
          }
        },
        (error) => {
          console.error(`❌ Lỗi khi xóa nhân viên ID: ${employeeId}:`, error);
          const errorMsg =
            error?.error?.message ||
            error?.message ||
            'Lỗi hệ thống không xác định. Vui lòng thử lại sau.';
          alert(
            `❌ Không thể xóa nhân viên ID: ${employeeId}.\nChi tiết lỗi: ${errorMsg}`
          );
        }
      );
    }
  }
}
