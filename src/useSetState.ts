import { useCallback, useState } from 'react';

type SetStateOption<S, T> = [(current: S) => Partial<T>] | [Partial<T>];

type ReturnStateType<S, T> = [
  state: S,
  setState: (...args: SetStateOption<S, T>) => void,
  resetState: (newState: S) => void
]

export default function useSetState<T extends {}>(initialState: T): ReturnStateType<T, T>;
export default function useSetState<T extends {}>(): ReturnStateType<T | Partial<T>, T>;
export default function useSetState<T extends {}>(initialState?: T):ReturnStateType<typeof initialState extends 
infer C ? C extends undefined ? Partial<T> : C : T, T> {
  const [state, set] = useState<typeof initialState extends 
  infer C ? C extends undefined ? Partial<T> : C : T>(
    initialState ?? ({} as any)
  );
  const setState = useCallback(
    (patch) => {
      set((prevState) => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch));
    },
    [set]
  );

  const resetState = useCallback(
    (newState: typeof state) => {
      set(newState);
    },
    [set]
  );

  return [state, setState, resetState];
}
