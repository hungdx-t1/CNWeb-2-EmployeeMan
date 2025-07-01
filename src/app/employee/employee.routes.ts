import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { QuanlynhanvienComponent } from "./quanlynhanvien/quanlynhanvien.component";
import { ThongtincanhanComponent } from "./thongtincanhan/thongtincanhan.component";
import { ChinhsuaComponent } from "./chinhsua/chinhsua.component";
import { PhanquyenComponent } from "./phanquyen/phanquyen.component";
import { LeaveRequestComponent } from "./leave-request/leave-request.component";
import { DonnghiphepComponent } from "./donnghiphep/donnghiphep.component";
import { QuanlydonnghiviecComponent } from "./quanlydonnghiviec/quanlydonnghiviec.component";
import { ChamcongComponent } from "./chamcong/chamcong.component";
import { LuongComponent } from "./luong/luong.component";
import { QuanLyLuongComponent } from "./quanlyluong/quanlyluong.component";
import { NhanVienComponent } from "./nhanvien/nhanvien.component";
import { HieuSuatComponent } from "./hieusuat/hieusuat.component";
import { HoSoXinViecComponent } from "./hosoxinviec/hosoxinviec.component";


export const employeeRoutes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'attendance', component: ChamcongComponent },
  { path: 'quanlynhanvien', component: QuanlynhanvienComponent },
  { path: 'thongtincanhan', component: ThongtincanhanComponent },
  { path: 'chinhsuathongtincanhan', component: ChinhsuaComponent },
  { path: 'phanquyen', component: PhanquyenComponent},
  { path: 'donnghiphep', component: DonnghiphepComponent},
  { path: 'guidonnghiphep', component: LeaveRequestComponent},
  { path: 'quanlydonnghiphep', component: QuanlydonnghiviecComponent},
  { path: 'luong', component: LuongComponent},
  { path: 'quanlyluong', component: QuanLyLuongComponent},
  { path: 'hosonhanvien', component: NhanVienComponent},
  { path: 'hieusuat', component: HieuSuatComponent},
  { path: 'hosoxinviec', component: HoSoXinViecComponent},
];
