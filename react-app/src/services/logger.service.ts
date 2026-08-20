export class LoggerService {
  log(message: string) {
    console.log(message);
  }
}

export const loggerService = new LoggerService();
