import { toast as sonnerToast, type ExternalToast } from "sonner";
import { cn } from "@/lib/utils";

export const toast = sonnerToast;

export function showSuccessToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast.success(message, {
    ...options,
    className: cn("border-success/30 text-foreground", options?.className),
  });
}

export function showErrorToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast.error(message, {
    ...options,
    className: cn("border-destructive/30 text-foreground", options?.className),
  });
}

export function showInfoToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast.info(message, {
    ...options,
    className: cn("border-accent/30 text-foreground", options?.className),
  });
}

export function showWarningToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast.warning(message, {
    ...options,
    className: cn("border-amber-500/30 text-foreground", options?.className),
  });
}

export function showWhatsAppToast(
  message: string,
  options?: ExternalToast & { description?: string }
) {
  return sonnerToast(message, {
    ...options,
    className: cn("border-success/40 text-foreground bg-card", options?.className),
  });
}
