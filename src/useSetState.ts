import { useCallback, useState } from 'react';

const useSetState = <T extends {}>(
  initialState?: T
): readonly [T, (patch: Partial<T> | ((prevState: T) => Partial<T>)) => void, (newState: T) => void] => {
  const [state, set] = useState<T>(initialState || ({} as T));
  const setState = useCallback(
    (patch) => {
      set((prevState) => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch));
    },
    [set]
  );

  const resetState = useCallback(
    (newState: T) => {
      set(newState);
    },
    [set]
  );

  return [state, setState, resetState];
};

export default useSetState;
