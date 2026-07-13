import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { JobOffersList } from './components/job-offers-list/job-offers-list';
import { Layout } from './components/layout/layout';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'job-offers', component: JobOffersList },
      { path: 'my-applications', component: Dashboard },
      { path: 'profile', component: Dashboard },
      { path: 'notifications', component: Dashboard },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];