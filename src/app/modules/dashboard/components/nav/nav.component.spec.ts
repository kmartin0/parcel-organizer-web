import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {NAV_BAR_STATES, NavComponent} from './nav.component';
import {UserService} from '../../../../shared/services/user/user.service';
import {NavigationStart, Router} from '@angular/router';
import {of} from 'rxjs';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ThemeService} from '../../../../shared/services/theme/theme.service';

describe('NavComponent', () => {
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let themeServiceSpy: jasmine.SpyObj<ThemeService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let component: NavComponent;
  let fixture: ComponentFixture<NavComponent>;

  beforeEach(() => {
    // Initialize spies
    userServiceSpy = jasmine.createSpyObj('UserService', ['logoutUser']);
    themeServiceSpy = jasmine.createSpyObj('ThemeService', ['toggleTheme']);
    routerSpy = jasmine.createSpyObj('Router', [], {events: of(null)});
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavComponent],
      providers: [
        {provide: UserService, useValue: userServiceSpy},
        {provide: ThemeService, useValue: themeServiceSpy},
        {provide: Router, useValue: routerSpy}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open the nav bar when hovered and in desktop mode.', () => {
    // Given
    spyOn(component.navBarStateChanged, 'emit');
    component.isMobileView = false;
    component.navBarState = NAV_BAR_STATES.CLOSED;

    // When
    component.onNavMouseEnter();

    // Then
    expect(component.navBarState as NAV_BAR_STATES).toEqual(NAV_BAR_STATES.OPENED);
    expect(component.navBarStateChanged.emit).toHaveBeenCalledWith(NAV_BAR_STATES.OPENED);
  });

  it('should not change nav bar when hovered and it\'s clipped.', () => {
    // Given
    component.isMobileView = false;
    component.navBarState = NAV_BAR_STATES.CLIPPED;

    // When
    component.onNavMouseEnter();

    // Then
    expect(component.navBarState as NAV_BAR_STATES).toEqual(NAV_BAR_STATES.CLIPPED);
  });

  it('should not open the nav bar when hovered and in mobile mode.', () => {
    // Given
    component.isMobileView = true;
    component.navBarState = NAV_BAR_STATES.CLOSED;

    // When
    component.onNavMouseEnter();

    // Then
    expect(component.navBarState as NAV_BAR_STATES).toEqual(NAV_BAR_STATES.CLOSED);
  });

  it('should close the nav bar when mouse leaves and in desktop mode.', () => {
    // Given
    spyOn(component.navBarStateChanged, 'emit');
    component.isMobileView = false;
    component.navBarState = NAV_BAR_STATES.OPENED;

    // When
    component.onNavMouseLeave();

    // Then
    expect(component.navBarState as NAV_BAR_STATES).toEqual(NAV_BAR_STATES.CLOSED);
    expect(component.navBarStateChanged.emit).toHaveBeenCalledWith(NAV_BAR_STATES.CLOSED);
  });

  it('should not close the nav bar when it\'s clipped.', () => {
    // Given
    component.isMobileView = false;
    component.navBarState = NAV_BAR_STATES.CLIPPED;

    // When
    component.onNavMouseLeave();

    // Then
    expect(component.navBarState as NAV_BAR_STATES).toEqual(NAV_BAR_STATES.CLIPPED);
  });

  it('should not close the nav bar when mouse leaves and in mobile mode.', () => {
    // Given
    component.isMobileView = true;
    component.navBarState = NAV_BAR_STATES.OPENED;

    // When
    component.onNavMouseLeave();

    // Then
    expect(component.navBarState as NAV_BAR_STATES).toEqual(NAV_BAR_STATES.OPENED);
  });

  it('should call logoutUser from userService.', () => {
    // When
    component.onLogout();

    // Then
    expect(userServiceSpy.logoutUser).toHaveBeenCalledTimes(1);
  });

  it('should call toggleTheme from themeService.', () => {
    // When
    component.onToggleTheme();

    // Then
    expect(themeServiceSpy.toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('should close nav bar when browser resizes to mobile view', () => {
    // Given
    component.isMobileView = false;
    component.navBarState = NAV_BAR_STATES.CLIPPED;
    spyOn(component.navBarStateChanged, 'emit');

    const event = {
      target: {
        innerWidth: component.maxMobileWidth / 2
      }
    };
    // When
    component.onResize(event);

    // Then
    expect(component.navBarState as NAV_BAR_STATES).toEqual(NAV_BAR_STATES.CLOSED);
    expect(component.navBarStateChanged.emit).toHaveBeenCalledWith(NAV_BAR_STATES.CLOSED);
    expect(component.isMobileView).toEqual(true);
  });

  it('should set mobile view to false when browser resizes to desktop size', () => {
    // Given
    component.isMobileView = true;

    const event = {
      target: {
        innerWidth: component.maxMobileWidth * 2
      }
    };
    // When
    component.onResize(event);

    // Then
    expect(component.isMobileView).toEqual(false);
  });

});
