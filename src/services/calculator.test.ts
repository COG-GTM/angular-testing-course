import { describe, it, expect, vi } from 'vitest';
import { CalculatorService } from './calculator';
import { LoggerService } from './logger';

describe('CalculatorService', () => {
  it('adds numbers and logs the result', () => {
    const logger = new LoggerService();
    const logSpy = vi.spyOn(logger, 'log').mockImplementation(() => {});
    const calc = new CalculatorService(logger);
    expect(calc.add(2, 3)).toBe(5);
    expect(logSpy).toHaveBeenCalledWith('Addition operation called', 5);
  });

  it('subtracts numbers and logs the result', () => {
    const logger = new LoggerService();
    const logSpy = vi.spyOn(logger, 'log').mockImplementation(() => {});
    const calc = new CalculatorService(logger);
    expect(calc.subtract(7, 2)).toBe(5);
    expect(logSpy).toHaveBeenCalledWith('Subtraction operation called', 5);
  });
});
