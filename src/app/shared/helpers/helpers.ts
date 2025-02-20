import {APP_THEME_MODE} from '../services/theme/theme.service';

/**
 * Returns the primary color used by angular material.
 * @param themeMode APP_THEME_MODE the theme mode for the primary color.
 */
export function getPrimaryColor(themeMode: APP_THEME_MODE): string {
  // Get the primary light-dark color
  const lightDarkPrimaryColor = getLightDarkCssVariable('--mat-sys-primary')

  // Return the primary color that matches the theme.
  return themeMode == APP_THEME_MODE.DARK ? lightDarkPrimaryColor.dark : lightDarkPrimaryColor.light;
}

/**
 * Retrieves a css variable in light-dark format from the computed styles.
 * @param key string The name of the css variable.
 */
export function getLightDarkCssVariable(key: string): { light: string; dark: string } {
  // Get the computed style from the body
  const computedStyle = getComputedStyle(document.body);

  // Return the light-dark variable in typescript object.
  return extractCssLightDark(computedStyle.getPropertyValue(key));
}

/**
 * light-dark(#006e1c, #78dc77)
 * @param value
 * @private
 */
export function extractCssLightDark(value: string): { light: string; dark: string } {
  if (value.includes('light-dark')) {
    const colors = value.split('(')[1].split(')')[0].split(',');
    return {
      light: colors[0].trim(),
      dark: colors[1].trim()
    };
  }
  // If not a light-dark() function, assume the same color for both
  return {light: value.trim(), dark: value.trim()};
}
