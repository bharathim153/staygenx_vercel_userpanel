export type ApiResponse<T = Record<string, unknown>> = {
  success: boolean;
  status?: boolean;
  statusCode?: number;
  message?: string;
  data?: T;
  body?: T;
};

export type ApiResponseWithStatus<T = Record<string, unknown>> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export type Data = {
  data: unknown | undefined;
};
