import pathToRegexp from 'path-to-regexp';

export interface PathFunctionOptions {
  pretty?: boolean;
  encode?: (value: string, token: Key) => string;
}

export type Token = string | Key;
export type Path = string | RegExp | Array<string | RegExp>;
export type PathFunction = (data?: Object, options?: PathFunctionOptions) => string;

export interface Key {
  name: string | number;
  prefix: string;
  delimiter: string;
  optional: boolean;
  repeat: boolean;
  pattern: string;
  partial: boolean;
}

const cache: { [key: string]: PathFunction } = {};
const cacheLimit = 10000;
let cacheCount = 0;

function compilePath(path: string) {
  if (cache[path]) return cache[path];

  const generator = pathToRegexp.compile(path);

  if (cacheCount < cacheLimit) {
    cache[path] = generator;
    cacheCount++;
  }

  return generator;
}

/**
 * Public API for generating a URL pathname from a path and parameters.
 */
function generatePath(path = '/', params = {}) {
  return path === '/' ? path : compilePath(path)(params, { pretty: true });
}

export default generatePath;
