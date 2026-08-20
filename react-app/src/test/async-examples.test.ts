import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Vitest counterparts of the Angular fakeAsync/tick/flush examples: vi.useFakeTimers()
 * replaces fakeAsync, vi.advanceTimersByTime() replaces tick() and
 * vi.runAllTimers() replaces flush().
 */
describe('Async Testing Examples', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('Asynchronous test example with a returned promise', async () => {
    let test = false;

    await new Promise<void>((resolve) => {
      setTimeout(() => {
        test = true;
        resolve();
      }, 1000);
    });

    expect(test).toBeTruthy();
  });

  it('Asynchronous test example - setTimeout()', () => {
    vi.useFakeTimers();

    let test = false;

    setTimeout(() => {});
    setTimeout(() => {
      test = true;
    }, 1000);

    vi.runAllTimers();

    expect(test).toBeTruthy();
  });

  it('Asynchronous test example - plain Promise', async () => {
    let test = false;

    void Promise.resolve()
      .then(() => Promise.resolve())
      .then(() => {
        test = true;
      });

    await vi.waitFor(() => expect(test).toBeTruthy());
  });

  it('Asynchronous test example - Promises + setTimeout()', async () => {
    vi.useFakeTimers();

    let counter = 0;

    void Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    await Promise.resolve().then(() => {});

    expect(counter).toBe(10);

    vi.advanceTimersByTime(500);
    expect(counter).toBe(10);

    vi.advanceTimersByTime(500);
    expect(counter).toBe(11);
  });
});
