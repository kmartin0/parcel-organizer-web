import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  @Input() width: string = '100px';
  @Input() height: string = '100px';
  isDisplaying = false;

  private animationCompleteCallback: () => void;
  @ViewChild(LottieComponent, {static: false}) private lottieComponent: LottieComponent;

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
      this.animationCompleteCallback();
      this.isDisplaying = false;
    });
  }

  play(animCompleteCallback?: () => void) {
    this.animationCompleteCallback = animCompleteCallback;
    this.isDisplaying = true;
  }

}
