export interface PaginatedResponseDto<T> {
  data: T;
  totalPages: number;
  total:number;
}
