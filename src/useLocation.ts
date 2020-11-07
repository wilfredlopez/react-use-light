/* eslint-disable */
import { useEffect, useState } from 'react';
import { isClient, off, on } from './util';

const patchHistoryMethod = (method) => {
  const original = history[method];

  history[method] = function (state) {
    const result = original.apply(this, arguments);
    const event = new Event(method.toLowerCase());

    (event as any).state = state;

    window.dispatchEvent(event);

    return result;
  };
};

if (isClient) {
  patchHistoryMethod('pushState');
  patchHistoryMethod('replaceState');
}

export interface LocationSensorState<S extends {} = {}> {
  trigger: string;
  state?: S;
  length?: number;
  hash?: string;
  host?: string;
  hostname?: string;
  href?: string;
  origin?: string;
  pathname?: string;
  port?: string;
  protocol?: string;
  search?: string;
}

const useLocationServer = <State extends {}>(): LocationSensorState<State> => ({
  trigger: 'load',
  length: 1,
});

const buildState = <State extends {}>(trigger: string) => {
  const { state, length } = history;

  const { hash, host, hostname, href, origin, pathname, port, protocol, search } = location;

  return {
    trigger,
    state,
    length,
    hash,
    host,
    hostname,
    href,
    origin,
    pathname,
    port,
    protocol,
    search,
  } as LocationSensorState<State>;
};

const useLocationBrowser = <State extends {}>(): LocationSensorState<State> => {
  const [state, setState] = useState(buildState('load'));

  useEffect(() => {
    const onPopstate = () => setState(buildState('popstate'));
    const onPushstate = () => setState(buildState('pushstate'));
    const onReplacestate = () => setState(buildState('replacestate'));

    on(window, 'popstate', onPopstate);
    on(window, 'pushstate', onPushstate);
    on(window, 'replacestate', onReplacestate);

    return () => {
      off(window, 'popstate', onPopstate);
      off(window, 'pushstate', onPushstate);
      off(window, 'replacestate', onReplacestate);
    };
  }, []);

  return state as LocationSensorState<State>;
};

const hasEventConstructor = typeof Event === 'function';

export default isClient && hasEventConstructor ? useLocationBrowser : useLocationServer;
