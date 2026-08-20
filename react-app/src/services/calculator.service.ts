import { LoggerService, loggerService } from './logger.service';

export class CalculatorService {
  private logger: LoggerService;

  constructor(logger: LoggerService = loggerService) {
    this.logger = logger;
  }

  add(n1: number, n2: number) {
    this.logger.log('Addition operation called');
    return n1 + n2;
  }

  subtract(n1: number, n2: number) {
    this.logger.log('Subtraction operation called');
    return n1 - n2;
  }
}
