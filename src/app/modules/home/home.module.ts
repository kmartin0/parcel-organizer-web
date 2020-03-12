import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from './pages/home/home.component';
import {LoginFormComponent} from '../../shared/components/login-form/login-form.component';
import {RegisterFormComponent} from './components/register-form/register-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {HomeRouteComponent} from './components/home-route/home-route.component';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    declarations: [
        // LoginFormComponent,
        RegisterFormComponent,
        HomeComponent,
        HomeRouteComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        ReactiveFormsModule,
        HomeRoutingModule,
    ]
})
export class HomeModule { }
