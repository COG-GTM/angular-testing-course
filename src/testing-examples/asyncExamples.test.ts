/**
 * Port of src/app/courses/home/async-examples.spec.ts (Jasmine + Angular testing utilities → Vitest).
 *
 * Angular / Jasmine                    → Vitest
 * ------------------------------------   ------------------------------------------------------------
 * it('…', (done: DoneFn) => …; done())  → return a Promise (or make the test `async`) and resolve it
 * fakeAsync(() => …)                    → vi.useFakeTimers() (+ vi.useRealTimers() in afterEach)
 * flush()                               → vi.runAllTimers() (drains every pending timer)
 * tick(ms)                              → vi.advanceTimersByTime(ms)
 * flushMicrotasks()                     → await Promise.resolve() / await vi.advanceTimersByTimeAsync(0)
 *                                         (microtasks are never faked; just yield to them)
 * waitForAsync / whenStable()           → await waitFor(...) / await findBy* (Testing Library)
 *
 * Unlike fakeAsync, Vitest's fake timers do not patch Promises, so draining microtasks is an
 * explicit `await`. The `async` variants (`vi.advanceTimersByTimeAsync`, `vi.runAllTimersAsync`)
 * also flush microtasks scheduled between timers.
 */
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

/** Lets every queued microtask (including chained `.then()`s) run: the `flushMicrotasks()` equivalent. */
async function flushMicrotasks(): Promise<void> {
  await vi.advanceTimersByTimeAsync(0);
}

describe('Async Testing Examples', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('Asynchronous test example with Jasmine done()', () => {
    // Real timers: Vitest waits for the returned Promise, just like Jasmine waits for done().
    return new Promise<void>((done) => {
      let test = false;

      setTimeout(() => {
        console.log('running assertions');

        test = true;

        expect(test).toBeTruthy();

        done();
      }, 1000);
    });
  });

  it('Asynchronous test example - setTimeout()', () => {
    vi.useFakeTimers();

    let test = false;

    setTimeout(() => {});

    setTimeout(() => {
      console.log('running assertions setTimeout()');

      test = true;
    }, 1000);

    vi.runAllTimers();

    expect(test).toBeTruthy();
  });

  it('Asynchronous test example - plain Promise', async () => {
    vi.useFakeTimers();

    let test = false;

    console.log('Creating promise');

    void Promise.resolve()
      .then(() => {
        console.log('Promise first then() evaluated successfully');

        return Promise.resolve();
      })
      .then(() => {
        console.log('Promise second then() evaluated successfully');

        test = true;
      });

    expect(test).toBe(false);

    await flushMicrotasks();

    console.log('Running test assertions');

    expect(test).toBeTruthy();
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

    await flushMicrotasks();

    expect(counter).toBe(10);

    vi.advanceTimersByTime(500);

    expect(counter).toBe(10);

    vi.advanceTimersByTime(500);

    expect(counter).toBe(11);
  });

  it('Asynchronous test example - Observables', () => {
    vi.useFakeTimers();

    let test = false;

    console.log('Creating Observable');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    vi.advanceTimersByTime(1000);

    console.log('Running test assertions');

    expect(test).toBe(true);
  });
});
