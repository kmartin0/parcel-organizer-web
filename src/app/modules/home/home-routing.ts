import {Routes} from '@angular/router';
import {HomeComponent} from './pages/home/home.component';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';

export const homeRoutes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
];
