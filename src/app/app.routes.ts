import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Signup } from './pages/signup/signup';

export const routes: Routes = [
  { path: 'signup', component: Signup },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];
