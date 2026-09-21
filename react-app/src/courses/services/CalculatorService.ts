import { LoggerService, loggerService } from './LoggerService';

export class CalculatorService {
  constructor(private logger: LoggerService = loggerService) {}

  add(n1: number, n2: number) {
    this.logger.log('Addition operation called');
    return n1 + n2;
  }

  subtract(n1: number, n2: number) {
    this.logger.log('Subtraction operation called');
    return n1 - n2;
  }
}

export const calculatorService = new CalculatorService();
