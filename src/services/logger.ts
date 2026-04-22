export class LoggerService {
  log(...args: unknown[]): void {
    console.log(...args);
  }
}

export const logger = new LoggerService();
