import { toast as sonnerToast, type ExternalToast } from "sonner";

export const toast = sonnerToast;

export function showSuccessToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast.success(message, {
    ...options,
    className: "border-success/30 text-foreground",
  });
}

export function showErrorToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast.error(message, {
    ...options,
    className: "border-destructive/30 text-foreground",
  });
}

export function showInfoToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast.info(message, {
    ...options,
    className: "border-accent/30 text-foreground",
  });
}

export function showWarningToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast.warning(message, {
    ...options,
    className: "border-amber-500/30 text-foreground",
  });
}

export function showWhatsAppToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast(message, {
    ...options,
    className: "border-success/40 text-foreground bg-card",
  });
}
