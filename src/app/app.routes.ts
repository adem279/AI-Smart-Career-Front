import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { JobOffersList } from './components/job-offers-list/job-offers-list';
import { JobOfferDetail } from './components/job-offer-detail/job-offer-detail';
import { MyApplications } from './components/my-applications/my-applications';
import { Profile } from './components/profile/profile';
import { Notifications } from './components/notifications/notifications';
import { MyJobOffers } from './components/my-job-offers/my-job-offers';
import { JobOfferForm } from './components/job-offer-form/job-offer-form';
import { OfferApplications } from './components/offer-applications/offer-applications';
import { CompanyProfile } from './components/company-profile/company-profile';
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
      { path: 'my-job-offers', component: MyJobOffers },
      { path: 'my-job-offers/new', component: JobOfferForm },
      { path: 'my-job-offers/:id/edit', component: JobOfferForm },
      { path: 'my-job-offers/:id/applications', component: OfferApplications },
      { path: 'company-profile', component: CompanyProfile },
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];