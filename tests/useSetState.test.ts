import { act, renderHook } from '@testing-library/react-hooks';
import useSetState from '../src/useSetState';

const setUp = <T extends {}>(initialState?: T) => renderHook(() => useSetState<T>(initialState as T));
interface CounterI {
  count: number;
  foo: string;
  someBool?: boolean;
}


it('should init state and setter', () => {
  const { result } = setUp({ foo: 'bar' });
  const [state, setState] = result.current;


  expect(state).toEqual({ foo: 'bar' });
  expect(setState).toBeInstanceOf(Function);
});

it('should init empty state if not initial state provided', () => {
  const { result } = setUp();

  expect(result.current[0]).toEqual({});
});

it('should merge changes into current state when providing object', () => {
  const { result } = setUp<CounterI>({ foo: 'bar', count: 1 });
  const [state, setState] = result.current;

  act(() => {


    setState({ count: state.count + 1, someBool: true });
  });

  expect(result.current[0]).toEqual({ foo: 'bar', count: 2, someBool: true });
});

it('should merge changes into current state when providing function', () => {
  const { result } = setUp({ foo: 'bar', count: 1 });
  const [, setState] = result.current;

  act(() => {
    setState((prevState) => ({ count: prevState.count + 1, someBool: true }));
  });

  expect(result.current[0]).toEqual({ foo: 'bar', count: 2, someBool: true });
});

/**
 * Enforces cases where a hook can safely depend on the callback without
 * causing an endless rerender cycle: useEffect(() => setState({ data }), [setState]);
 */
it('should return a memoized setState callback', () => {
  const { result, rerender } = setUp({ ok: false });
  const [, setState1] = result.current;

  act(() => {
    setState1({ ok: true });
  });
  rerender();

  const [, setState2] = result.current;

  expect(setState1).toBe(setState2);
});

it('resets state', () => {
  const { result } = setUp<CounterI>({ foo: 'bar', count: 1 });
  const [, , resetState] = result.current;
  const resetTo = { count: 0, foo: 'newFoo' };

  act(() => {
    resetState(resetTo);
  });

  expect(result.current[0]).toEqual(resetTo);
});
