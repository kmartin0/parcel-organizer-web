import {APP_THEME_MODE, ThemeService} from './theme.service';
import {TestBed} from '@angular/core/testing';
import {Meta} from '@angular/platform-browser';
import {NgZone} from '@angular/core';

describe('ThemeService', () => {
  let themeService: ThemeService;
  let meta: Meta;
  let ngZone: NgZone;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Meta, {provide: NgZone, useValue: new NgZone({enableLongStackTrace: false})}]
    });

    meta = TestBed.inject(Meta);
    ngZone = TestBed.inject(NgZone);

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(null);

    themeService = new ThemeService(meta, ngZone);
  });

  it('should set theme to default (light) when no persisted theme is present', () => {
    expect(themeService.themeMode).toBe(APP_THEME_MODE.LIGHT);
    expect(document.body.classList).toContain(APP_THEME_MODE.LIGHT);
    expect(document.body.classList).not.toContain(APP_THEME_MODE.DARK);
  });

  it('should set theme to persisted theme (dark)', () => {
    localStorage.getItem = jasmine.createSpy().and.returnValue(APP_THEME_MODE.DARK);
    themeService = new ThemeService(meta, ngZone); // Reinitialize service

    expect(themeService.themeMode).toBe(APP_THEME_MODE.DARK);
    expect(document.body.classList).toContain(APP_THEME_MODE.DARK);
    expect(document.body.classList).not.toContain(APP_THEME_MODE.LIGHT);
  });

  it('should toggle theme from light to dark', () => {
    themeService.toggleThemeMode();

    expect(themeService.themeMode).toBe(APP_THEME_MODE.DARK);
    expect(document.body.classList).toContain(APP_THEME_MODE.DARK);
    expect(document.body.classList).not.toContain(APP_THEME_MODE.LIGHT);
  });

  it('should toggle theme from dark to light', () => {
    localStorage.getItem = jasmine.createSpy().and.returnValue(APP_THEME_MODE.DARK);
    themeService = new ThemeService(meta, ngZone); // Reinitialize service

    themeService.toggleThemeMode();

    expect(themeService.themeMode).toBe(APP_THEME_MODE.LIGHT);
    expect(document.body.classList).toContain(APP_THEME_MODE.LIGHT);
    expect(document.body.classList).not.toContain(APP_THEME_MODE.DARK);
  });
});
