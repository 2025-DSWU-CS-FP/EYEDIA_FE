export type ToastType = 'success' | 'error' | 'info' | 'warning';
type ToastFn = (message: string, type?: ToastType) => void;

let handler: ToastFn | null = null;
let lastShownAt = 0;

export function registerToast(fn: ToastFn) {
  handler = fn;
}

export function showGlobalToast(message: string, type: ToastType = 'error') {
  const now = Date.now();
  if (now - lastShownAt < 3000) return;
  lastShownAt = now;
  handler?.(message, type);
}
