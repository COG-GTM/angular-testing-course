import { log } from './logger';

// React port of the Angular CalculatorService.
export function add(n1: number, n2: number): number {
  log('Addition operation called');
  return n1 + n2;
}

export function subtract(n1: number, n2: number): number {
  log('Subtraction operation called');
  return n1 - n2;
}
