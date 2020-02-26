import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {FormComponent} from '../dynamic-form/form/form.component';
import {AnimationEventCallback, AnimationItem} from 'lottie-web';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  @Output() successComplete = new EventEmitter<any>();

  private animationItem: AnimationItem;

  @ViewChild(LottieComponent, {static: false}) private lottieComponent: LottieComponent;

  options: AnimationOptions = {
    path: '/assets/lottie_success.json',
    autoplay: false,
    loop: false
  };

  styles: Partial<CSSStyleDeclaration> = {};

  constructor() {
    console.log(this.lottieComponent);
  }

  ngOnInit() {
    console.log(this.lottieComponent);
  }

  animationCreated(animationItem: AnimationItem): void {
    this.animationItem = animationItem;
  }

  play(callback: () => void) {
    this.animationItem.play();
    this.animationItem.addEventListener('complete', args => {
      this.animationItem.stop();
      callback();
    });

  }

}
