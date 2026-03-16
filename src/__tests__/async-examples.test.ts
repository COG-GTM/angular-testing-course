import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('Async Testing Examples', () => {
  it('Asynchronous test example with done callback pattern', () => {
    return new Promise<void>((done) => {
      let test = false;

      setTimeout(() => {
        test = true;
        expect(test).toBeTruthy();
        done();
      }, 1000);

      vi.useFakeTimers();
      vi.advanceTimersByTime(1000);
      vi.useRealTimers();
    });
  });

  it('Asynchronous test example - setTimeout() with fake timers', () => {
    vi.useFakeTimers();

    let test = false;

    setTimeout(() => {});

    setTimeout(() => {
      test = true;
    }, 1000);

    vi.advanceTimersByTime(1000);

    expect(test).toBeTruthy();

    vi.useRealTimers();
  });

  it('Asynchronous test example - plain Promise', async () => {
    let test = false;

    await Promise.resolve()
      .then(() => {
        return Promise.resolve();
      })
      .then(() => {
        test = true;
      });

    expect(test).toBeTruthy();
  });

  it('Asynchronous test example - Promises + setTimeout()', async () => {
    vi.useFakeTimers();

    let counter = 0;

    const promise = Promise.resolve().then(() => {
      counter += 10;

      setTimeout(() => {
        counter += 1;
      }, 1000);
    });

    expect(counter).toBe(0);

    await promise;

    expect(counter).toBe(10);

    vi.advanceTimersByTime(500);
    expect(counter).toBe(10);

    vi.advanceTimersByTime(500);
    expect(counter).toBe(11);

    vi.useRealTimers();
  });

  it('Asynchronous test example - Promise-based delay', async () => {
    vi.useFakeTimers();

    let test = false;

    const delayPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        test = true;
        resolve();
      }, 1000);
    });

    vi.advanceTimersByTime(1000);

    await delayPromise;

    expect(test).toBe(true);

    vi.useRealTimers();
  });
});
