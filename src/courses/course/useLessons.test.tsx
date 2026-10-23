import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AppProviders } from '../../AppProviders';
import { createCoursesServiceSpy } from '../common/testUtils';
import type { Lesson } from '../model/lesson';
import { useLessons } from './useLessons';

const lesson: Lesson = { id: 1, description: 'Lesson', duration: '1:00', seqNo: 1, courseId: 12 };

function renderUseLessons(spy: ReturnType<typeof createCoursesServiceSpy>) {
  const wrapper = ({ children }: { children: ReactNode }) => <AppProviders coursesService={spy}>{children}</AppProviders>;
  return renderHook(() => useLessons(), { wrapper });
}

describe('useLessons (LessonsDataSource port)', () => {
  it('should start empty and not loading', () => {
    const { result } = renderUseLessons(createCoursesServiceSpy());

    expect(result.current.lessons).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should toggle loading and emit the loaded lessons', async () => {
    const spy = createCoursesServiceSpy();
    spy.findLessons.mockResolvedValue([lesson]);
    const { result } = renderUseLessons(spy);

    act(() => result.current.loadLessons(12, 'abc', 'desc', 2, 5));

    expect(result.current.loading).toBe(true);
    expect(spy.findLessons).toHaveBeenCalledWith(12, 'abc', 'desc', 2, 5, { signal: expect.any(AbortSignal) });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lessons).toEqual([lesson]);
  });

  it('should emit an empty list when the request fails', async () => {
    const spy = createCoursesServiceSpy();
    spy.findLessons.mockResolvedValueOnce([lesson]).mockRejectedValueOnce(new Error('boom'));
    const { result } = renderUseLessons(spy);

    act(() => result.current.loadLessons(12, '', 'asc', 0, 3));
    await waitFor(() => expect(result.current.lessons).toEqual([lesson]));

    act(() => result.current.loadLessons(12, '', 'asc', 1, 3));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.lessons).toEqual([]);
  });

  it('should abort the previous request when a new one starts', () => {
    const spy = createCoursesServiceSpy();
    spy.findLessons.mockReturnValue(new Promise(() => {}));
    const { result, unmount } = renderUseLessons(spy);

    act(() => result.current.loadLessons(12, '', 'asc', 0, 3));
    act(() => result.current.loadLessons(12, '', 'asc', 1, 3));

    const [first, second] = spy.findLessons.mock.calls.map((call) => call[5]?.signal);
    expect(first?.aborted).toBe(true);
    expect(second?.aborted).toBe(false);

    unmount();
    expect(second?.aborted).toBe(true);
  });
});
