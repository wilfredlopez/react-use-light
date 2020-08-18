import { DependencyList, useEffect } from "react";
import useAsyncFn from "./useAsyncFn";
import { FnReturningPromise } from "./util";

export { AsyncState, AsyncFnReturn } from "./useAsyncFn";

/**
 * 
 * @param fn 
 * @param deps 
 * @example

const Demo = ({url}) => {
  const state = useAsync(async () => {
    const response = await fetch(url);
    const result = await response.text();
    return result
  }, [url]);

  return (
    <div>
      {state.loading
        ? <div>Loading...</div>
        : state.error
          ? <div>Error: {state.error.message}</div>
          : <div>Value: {state.value}</div>
      }
    </div>
  );
};
 */
export default function useAsync<T extends FnReturningPromise>(
  fn: T,
  deps: DependencyList = [],
) {
  const [state, callback] = useAsyncFn(fn, deps, {
    loading: true,
  });

  useEffect(() => {
    callback();
  }, [callback]);

  return state;
}
