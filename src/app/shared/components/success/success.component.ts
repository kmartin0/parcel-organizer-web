import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';
import {AnimationItem} from 'lottie-web';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  @Output() successComplete = new EventEmitter<any>();
  @Input() width: string = '100px';
  @Input() height: string = '100px';

  private isDisplaying = false;

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
      this.successComplete.emit();
      this.isDisplaying = false;
    });
  }

  play() {
    this.isDisplaying = true;
  }

}
