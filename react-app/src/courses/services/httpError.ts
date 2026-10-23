/** Rejection value for non-2xx responses; the React equivalent of Angular's `HttpErrorResponse`. */
export class HttpError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly url: string;
  /** Raw response body (parsed as JSON when possible), like `HttpErrorResponse.error`. */
  readonly body: unknown;

  constructor(status: number, statusText: string, url: string, body?: unknown) {
    super(`Http failure response for ${url}: ${status} ${statusText}`);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    this.body = body;
  }
}
