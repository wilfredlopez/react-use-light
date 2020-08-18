import { useEffect, useState } from "react";
import { isClient } from "./util";

/**
 * React sensor hook that tracks state of a CSS media query.
 * @param query 
 * @param defaultState 
 * @example
 * const Demo = () => {
  const isWide = useMedia('(min-width: 480px)');

  return (
    <div>
      Screen is wide: {isWide ? 'Yes' : 'No'}
    </div>
  );
};
 */
const useMedia = (query: string, defaultState: boolean = false) => {
  const [state, setState] = useState(
    isClient ? () => window.matchMedia(query).matches : defaultState,
  );

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(query);
    const onChange = () => {
      if (!mounted) {
        return;
      }
      setState(!!mql.matches);
    };

    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeListener(onChange);
    };
  }, [query]);

  return state;
};

export default useMedia;
