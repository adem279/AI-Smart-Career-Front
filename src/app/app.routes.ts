import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { JobOffersList } from './components/job-offers-list/job-offers-list';
import { JobOfferDetail } from './components/job-offer-detail/job-offer-detail';
import { MyApplications } from './components/my-applications/my-applications';
import { Profile } from './components/profile/profile';
import { Notifications } from './components/notifications/notifications';
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
      { path: 'job-offers/:id', component: JobOfferDetail },
      { path: 'my-applications', component: MyApplications },
      { path: 'profile', component: Profile },
      { path: 'notifications', component: Notifications },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];