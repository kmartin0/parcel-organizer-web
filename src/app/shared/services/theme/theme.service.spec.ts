import {ThemeService} from './theme.service';
import {TestBed} from '@angular/core/testing';
import {OverlayContainer} from '@angular/cdk/overlay';

describe('ThemeService', () => {

  let themeService: ThemeService;
  let overlayContainer: OverlayContainer;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [OverlayContainer]
    });
    overlayContainer = TestBed.inject(OverlayContainer);
    themeService = null;
  });

  it('should set theme to default when no persisted theme present', () => {

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    themeService = new ThemeService(overlayContainer);

    const classList = overlayContainer.getContainerElement().classList;

    expect(classList).toContain('theme-default');
    expect(classList).not.toContain('theme-dark');

  });

  it('should set theme to persisted theme (dark)', () => {

    spyOn(localStorage, 'getItem').and.returnValue('true');
    spyOn(localStorage, 'setItem');

    themeService = new ThemeService(overlayContainer);

    const classList = overlayContainer.getContainerElement().classList;

    expect(classList).toContain('theme-dark');
    expect(classList).not.toContain('theme-default');

  });

  it('should toggle theme from default to dark', () => {

    spyOn(localStorage, 'getItem').and.returnValue(null);
    spyOn(localStorage, 'setItem');

    themeService = new ThemeService(overlayContainer);

    const classList = overlayContainer.getContainerElement().classList;

    themeService.toggleTheme();

    expect(classList).toContain('theme-dark');
    expect(classList).not.toContain('theme-default');

  });

});
