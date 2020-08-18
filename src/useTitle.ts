/* eslint-disable */
import { useRef, useEffect } from "react";
export interface UseTitleOptions {
  restoreOnUnmount?: boolean;
}
const DEFAULT_USE_TITLE_OPTIONS: UseTitleOptions = {
  restoreOnUnmount: false,
};

/**
 * sets title of the page.
 * @param title 
 * @param options 
 * @example
 * const Demo = () => {
  useTitle('Hello world!');

  return null;
};
 */
function useTitle(
  title: string,
  options: UseTitleOptions = DEFAULT_USE_TITLE_OPTIONS,
) {
  const prevTitleRef = useRef(document.title);
  document.title = title;
  useEffect(() => {
    if (options && options.restoreOnUnmount) {
      return () => {
        document.title = prevTitleRef.current;
      };
    } else {
      return;
    }
  }, []);
}

export default typeof document !== "undefined"
  ? useTitle
  : (_title: string) => {};
