import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {HeaderComponent} from './header.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {NAV_BAR_STATES} from '../nav/nav.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component.changeNavBarState, 'emit');
  });

  it('should toggle nav bar state to closed when current state is clipped.', () => {
    // Given
    component.navBarState = NAV_BAR_STATES.CLIPPED;

    // When
    component.toggleNavBarClip();

    // Then
    expect(component.changeNavBarState.emit).toHaveBeenCalledWith(NAV_BAR_STATES.CLOSED);
  });

  it('should toggle nav bar state to clipped when current state is closed.', () => {
    // Given
    component.navBarState = NAV_BAR_STATES.CLOSED;

    // When
    component.toggleNavBarClip();

    // Then
    expect(component.changeNavBarState.emit).toHaveBeenCalledWith(NAV_BAR_STATES.CLIPPED);
  });

  it('should toggle nav bar state to clipped when current state is opened.', () => {
    // Given
    component.navBarState = NAV_BAR_STATES.OPENED;

    // When
    component.toggleNavBarClip();

    // Then
    expect(component.changeNavBarState.emit).toHaveBeenCalledWith(NAV_BAR_STATES.CLIPPED);
  });
});
