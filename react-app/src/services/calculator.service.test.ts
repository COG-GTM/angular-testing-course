import { describe, it, expect, vi } from 'vitest';
import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {
  function setup() {
    const logger = new LoggerService();
    const logSpy = vi.spyOn(logger, 'log').mockImplementation(() => {});
    const calculator = new CalculatorService(logger);
    return { calculator, logSpy };
  }

  it('should add two numbers', () => {
    const { calculator, logSpy } = setup();
    const result = calculator.add(2, 2);
    expect(result).toBe(4);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    const { calculator, logSpy } = setup();
    const result = calculator.subtract(2, 2);
    expect(result).toBe(0);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
