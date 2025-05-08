export type SuccessResponse<T = void> = {
  success: true;
  message: string;
} & (T extends void ? {} : { data: T });

export type ErrorResponse = {
  success: false;
  error: string;
  isFormError?: boolean;
};

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    totalPage: number;
  };
  data: T;
} & Omit<SuccessResponse, "data">;
