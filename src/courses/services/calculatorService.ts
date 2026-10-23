import { LoggerService, loggerService } from './loggerService';

export class CalculatorService {
  private readonly logger: LoggerService;

  constructor(logger: LoggerService) {
    this.logger = logger;
  }

  add(n1: number, n2: number): number {
    this.logger.log('Addition operation called');
    return n1 + n2;
  }

  subtract(n1: number, n2: number): number {
    this.logger.log('Subtraction operation called');
    return n1 - n2;
  }
}

export const calculatorService = new CalculatorService(loggerService);
