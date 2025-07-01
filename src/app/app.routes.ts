import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './core/guard/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full'},
    { path: 'login', component: LoginComponent },
    { path: 'main', loadChildren: () => import('./employee/employee.routes').then(m => m.employeeRoutes), canActivate: [AuthGuard]},
    { path: '**', redirectTo: '/main'}
];
