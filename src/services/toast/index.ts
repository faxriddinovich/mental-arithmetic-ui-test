import { ToastProgrammatic as Toast } from 'buefy'

export enum ToastType {
  Default,
  Success = 'is-success',
  Danger = 'is-danger',
  Warning = 'is-warning',
  Link = 'is-link'
}

export function showToastMessage(
  message: string,
  type: ToastType = ToastType.Default
): void {
  const toastOptions = { message }

  if(type !== ToastType.Default)
    toastOptions['type'] = type;

  Toast.open(toastOptions);
}
