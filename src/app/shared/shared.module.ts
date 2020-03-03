import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormComponent} from './components/dynamic-form/form/form.component';
import {TextInputComponent} from './components/dynamic-form/input/text-input/text-input.component';
import {ButtonComponent} from './components/button/button.component';
import {SuccessComponent} from './components/success/success.component';
import {LottieModule} from 'ngx-lottie';
import {ReactiveFormsModule} from '@angular/forms';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import player from 'lottie-web';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';

// Note we need a separate function as it's required
// by the AOT compiler
export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    FormComponent,
    TextInputComponent,
    ButtonComponent,
    SuccessComponent,
    PageNotFoundComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    LottieModule.forRoot({player: playerFactory}),
  ],
  exports: [
    FormComponent,
    TextInputComponent,
    ButtonComponent,
    SuccessComponent,
    PageNotFoundComponent
  ]
})
export class SharedModule { }
