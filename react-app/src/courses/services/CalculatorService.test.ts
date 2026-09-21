import { CalculatorService } from './CalculatorService';
import { LoggerService } from './LoggerService';

describe('CalculatorService', () => {
  let calculator: CalculatorService;
  let logSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    const logger = new LoggerService();
    logSpy = vi.spyOn(logger, 'log').mockImplementation(() => {});
    calculator = new CalculatorService(logger);
  });

  it('should add two numbers', () => {
    expect(calculator.add(2, 2)).toBe(4);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    expect(calculator.subtract(2, 2)).toBe(0);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});
