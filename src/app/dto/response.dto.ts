export interface ServerResponse<T> {
    error: boolean;
    message: string;
    status: number;
    data: T;
}