import {Capacitor} from '@capacitor/core';

export function isWeb() {
  return Capacitor.getPlatform() === 'web';
}

export function isAndroid() {
  return Capacitor.getPlatform() === 'android';
}

export function isIOS() {
  return Capacitor.getPlatform() === 'ios';
}

/* Source: https://stackoverflow.com/a/61725416 */
export function isElectron() {
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    return true;
  }

  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    return true;
  }

  if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }

  return false;

}

export function isNative() {
  return Capacitor.isNativePlatform() || isElectron();
}
