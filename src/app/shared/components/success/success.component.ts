import {Component, Input, OnInit} from '@angular/core';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss'],
  imports: [
    LottieComponent,
    NgIf
  ],
  standalone: true
})
export class SuccessComponent implements OnInit {

  @Input() width = '100px';
  @Input() height = '100px';
  isDisplaying = false;

  private animationCompleteCallback?: () => void;

  options: AnimationOptions = {
    path: '/assets/lottie_success.json',
    autoplay: false,
    loop: false,
  };

  styles: Partial<CSSStyleDeclaration> = {
    width: this.width,
    height: this.height
  };

  constructor() {
  }

  ngOnInit() {
  }

  animationCreated(animationItem: AnimationItem): void {
    animationItem.play();
    animationItem.addEventListener('complete', args => {
      animationItem.stop();
      if (this.animationCompleteCallback) {
        this.animationCompleteCallback();
      }
      this.isDisplaying = false;
    });
  }

  play(animCompleteCallback?: () => void) {
    this.animationCompleteCallback = animCompleteCallback;
    this.isDisplaying = true;
  }

}
