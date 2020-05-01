import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './pages/home/home.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeRouteComponent} from './components/home-route/home-route.component';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    HomeComponent,
    HomeRouteComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    FontAwesomeModule,
    MatTooltipModule,
  ]
})
export class HomeModule {
}
