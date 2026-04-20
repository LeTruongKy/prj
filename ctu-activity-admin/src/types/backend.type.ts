export interface IBackendRes<T> {
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path: string;
}
