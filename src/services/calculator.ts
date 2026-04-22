import { LoggerService, logger as defaultLogger } from './logger';

export class CalculatorService {
  constructor(private logger: LoggerService = defaultLogger) {}

  add(n1: number, n2: number): number {
    const result = n1 + n2;
    this.logger.log('Addition operation called', result);
    return result;
  }

  subtract(n1: number, n2: number): number {
    const result = n1 - n2;
    this.logger.log('Subtraction operation called', result);
    return result;
  }
}
