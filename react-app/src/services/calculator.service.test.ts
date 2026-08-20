import { describe, expect, it, vi } from 'vitest';
import { CalculatorService } from './calculator.service';
import { LoggerService } from './logger.service';

describe('CalculatorService', () => {
  function setup() {
    const logger = new LoggerService();
    const logSpy = vi.spyOn(logger, 'log').mockImplementation(() => {});
    return { calculator: new CalculatorService(logger), logSpy };
  }

  it('should add two numbers', () => {
    const { calculator, logSpy } = setup();

    expect(calculator.add(2, 2)).toBe(4);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    const { calculator, logSpy } = setup();

    expect(calculator.subtract(2, 2)).toBe(0);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
