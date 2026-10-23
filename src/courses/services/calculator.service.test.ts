import { CalculatorService } from './calculatorService';
import type { LoggerService } from './loggerService';

// Port of src/app/courses/services/calculator.service.spec.ts
describe('CalculatorService', () => {
  let calculator: CalculatorService;
  let loggerSpy: { log: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    loggerSpy = { log: vi.fn() };
    calculator = new CalculatorService(loggerSpy as unknown as LoggerService);
  });

  it('should add two numbers', () => {
    const result = calculator.add(2, 2);

    expect(result).toBe(4);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });

  it('should subtract two numbers', () => {
    const result = calculator.subtract(2, 2);

    expect(result, 'unexpected subtraction result').toBe(0);
    expect(loggerSpy.log).toHaveBeenCalledTimes(1);
  });
});
