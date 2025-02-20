import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {Component, Input, NO_ERRORS_SCHEMA} from '@angular/core';
import {SuccessComponent} from './success.component';
import {AnimationOptions, LottieComponent} from 'ngx-lottie';

@Component({
  selector: 'ng-lottie',
  template: '',
  providers: [{provide: LottieComponent, useClass: LottieComponentStub}],
  standalone: true
})
export class LottieComponentStub {
  @Input() width: string = '';
  @Input() height: string = '';
  @Input() options: AnimationOptions = {};
  @Input() styles: Partial<CSSStyleDeclaration> = {};
}

describe('SuccessComponent', () => {
  let component: SuccessComponent;
  let fixture: ComponentFixture<SuccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SuccessComponent],
      declarations: [],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .overrideComponent(SuccessComponent, {
        remove: {imports: [LottieComponent]},
        add: {imports: [LottieComponentStub]},
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set isDisplaying to true', () => {
    // Given
    component.isDisplaying = false;

    // When
    component.play();

    // Then
    expect(component.isDisplaying).toEqual(true);
  });
});
