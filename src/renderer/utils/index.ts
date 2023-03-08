import { Color } from "shared/types/Color";

export function getBrightness(color: Color) {
  return (color.r + color.g + color.b) / 3;
}

export function changeTheme(lightTheme: boolean) {
  if (lightTheme) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }
}
