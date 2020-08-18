import { useState, useCallback } from "react";
import useLifecycles from "./useLifecycles";

/**
 * read and write url hash, response to url hash change.
 * tracks location hash value
 * @example
 * const Demo = () => {
  const [hash, setHash] = useHash();

  useMount(() => {
    setHash('#/path/to/page?userId=123');
  });

  return (
    <div>
      <div>window.location.href:</div>
      <div>
        <pre>{window.location.href}</pre>
      </div>
      <div>Edit hash: </div>
      <div>
        <input style={{ width: '100%' }} value={hash} onChange={e => setHash(e.target.value)} />
      </div>
    </div>
  );
};
 */
export const useHash = () => {
  const [hash, setHash] = useState(() => window.location.hash);

  const onHashChange = useCallback(() => {
    setHash(window.location.hash);
  }, []);

  useLifecycles(() => {
    window.addEventListener("hashchange", onHashChange);
  }, () => {
    window.removeEventListener("hashchange", onHashChange);
  });

  const _setHash = useCallback((newHash: string) => {
    if (newHash !== hash) {
      window.location.hash = newHash;
    }
  }, [hash]);

  return [hash, _setHash] as const;
};
