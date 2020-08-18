/* eslint-disable */
import { DependencyList, useMemo } from "react";
import useEvent, { UseEventTarget } from "./useEvent";

export type KeyPredicate = (event: KeyboardEvent) => boolean;
export type KeyFilter =
  | null
  | undefined
  | string
  | ((event: KeyboardEvent) => boolean);
export type Handler = (event: KeyboardEvent) => void;

export interface UseKeyOptions {
  event?: "keydown" | "keypress" | "keyup";
  target?: UseEventTarget;
  options?: any;
}

const noop = () => {};
const createKeyPredicate = (keyFilter: KeyFilter): KeyPredicate =>
  typeof keyFilter === "function"
    ? keyFilter
    : typeof keyFilter === "string"
    ? (event: KeyboardEvent) => event.key === keyFilter
    : keyFilter
    ? () => true
    : () => false;

/**
 * 
 * @param key 
 * @param fn 
 * @param opts 
 * @param deps 
 * @example
 * import {useKey} from 'react-use';

const Demo = () => {
  const [count, set] = useState(0);
  const increment = () => set(count => ++count);
  useKey('ArrowUp', increment);

  return (
    <div>
      Press arrow up: {count}
    </div>
  );
};
 */
const useKey = (
  key: KeyFilter,
  fn: Handler = noop,
  opts: UseKeyOptions = {},
  deps: DependencyList = [key],
) => {
  const { event = "keydown", target, options } = opts;
  const useMemoHandler = useMemo(() => {
    const predicate: KeyPredicate = createKeyPredicate(key);
    const handler: Handler = (handlerEvent) => {
      if (predicate(handlerEvent)) {
        return fn(handlerEvent);
      }
    };
    return handler;
  }, deps);
  useEvent(event, useMemoHandler, target, options);
};

export default useKey;
