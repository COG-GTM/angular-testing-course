import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CalculatorService } from '../calculator-service';
import { LoggerService } from '../logger-service';

describe('CalculatorService', () => {
  let calculator: CalculatorService;
  let loggerSpy: LoggerService;

  beforeEach(() => {
    loggerSpy = {
      log: vi.fn(),
    } as unknown as LoggerService;

    calculator = new CalculatorService(loggerSpy);
  });

  it('should add two numbers', () => {
    const result = calculator.add(2, 2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    const result = calculator.subtract(2, 2);

    expect(result).toBe(0);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
