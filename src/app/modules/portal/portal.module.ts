import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PortalRoutingModule} from './portal-routing.module';
import {MainComponent} from './pages/main/main.component';
import {PortalComponent} from './pages/portal/portal.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {NavComponent} from './components/nav/nav.component';
import {PortalPageComponent} from './components/portal-page/portal-page.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SharedModule} from '../../shared/shared.module';
import {HomeModule} from '../home/home.module';


@NgModule({
  declarations: [
    PortalComponent,
    PortalPageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    MainComponent
  ],
    imports: [
        CommonModule,
        PortalRoutingModule,
        FontAwesomeModule,
        SharedModule,
        HomeModule
    ]
})
export class PortalModule { }
