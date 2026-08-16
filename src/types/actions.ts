/**
 * MUSCLEWORKS SUPPLEMENTS — SERVER ACTION RESULT CONTRACTS
 * Standardized discriminated union envelope for all Next.js 16 Server Actions.
 */

export type ActionSuccess<T = void> = {
  success: true;
  data: T;
  message?: string;
};

export type ActionError = {
  success: false;
  error: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResult<T = void> = ActionSuccess<T> | ActionError;
