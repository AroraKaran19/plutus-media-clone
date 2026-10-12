import type { FieldIssue } from "../utils/zod-error";

export interface CustomError extends Error {
  statusCode?: number;
  code?: string | number;
  keyValue?: any;
  errors?: any;
  path?: string;
  value?: any;
  /** Per-field validation failures, set when a ZodError is mapped to a 400. */
  fieldIssues?: FieldIssue[];
}

export interface ErrorResponse {
  success: boolean;
  error: {
    message: string;
    type: string;
    statusCode: number;
    details?: any;
    timestamp: string;
    path: string;
    /** Present on validation failures so the form can list every bad field. */
    fieldIssues?: FieldIssue[];
  };
}
