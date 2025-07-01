import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface JobApplication {
  name: string;
  position: string;
  experience: string;
  contact: string;
  status: string;
}

@Component({
  selector: 'app-hosoxinviec',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hosoxinviec.component.html',
  styleUrls: ['./hosoxinviec.component.css']
})
export class HoSoXinViecComponent {
  applications: JobApplication[] = [
    {
      name: 'Nguyễn Văn A',
      position: 'Lập trình viên Frontend',
      experience: '2 năm tại công ty ABC',
      contact: 'a.nguyen@email.com | 0912 345 678',
      status: 'Đang chờ duyệt'
    },
    {
      name: 'Trần Thị B',
      position: 'Nhân viên kế toán',
      experience: '1 năm tại công ty XYZ',
      contact: 'b.tran@email.com | 0934 567 890',
      status: 'Đã duyệt'
    },
    {
      name: 'Lê Văn C',
      position: 'Chuyên viên nhân sự',
      experience: '3 năm tại công ty DEF',
      contact: 'c.le@email.com | 0978 123 456',
      status: 'Từ chối'
    }
  ];
}
