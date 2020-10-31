import generatePath from './generatePath';

export type RouteGetterParams<T extends string | number | boolean | undefined> = T extends undefined
  ? undefined
  : {
      [paramName: string]: T;
    };

export type RouterGetterRecord<T extends string> = Record<
  T,
  {
    value: string;
    params?: RouteGetterParams<any>;
  }
>;

/**
 * Generates Type Safed Routes for React Router or any other router.
 * @example
 *
 * //Creating Interfaces
 * type RouteKeys = 'home' | 'profile';
 *
 * interface RouteType extends RouterGetterRecord<RouteKeys> {
 *   home: {
 *     value: string;
 *   };
 *   profile: {
 *     value: string;
 *     params: {
 *       id: string;
 *     };
 *   };
 * }
 *
 * //Creating Instance
 * const appRoutes = new RouteGetterGenerator<RouteKeys, RouteType>({
 *   home: {
 *     value: '/',
 *   },
 *   profile: {
 *     value: '/profile/:id',
 *     params: {
 *       id: '',
 *     },
 *   },
 * });
 * //Using Instance with Type Safety
 * appRoutes.path('profile', { id: '1' });
 * // appRoutes.path('profile', { ss:'' }) // TypeError: Object literal may only specify known properties, and 'ss' does not exist in type '{ id: string; }'.ts(2345);
 * appRoutes.path('home');
 * // appRoutes.path('other'); // Argument of type '"other"' is not assignable to parameter of type 'RouteKeys'.
 */
export class RouteGetterGenerator<K extends string, RouteType extends RouterGetterRecord<K>> {
  private _routes: RouteType;
  constructor(routes: RouteType) {
    this._routes = routes;
  }

  get routes(): RouteType {
    return Object.assign({}, this._routes) as RouteType;
  }

  /**
   *
   * @param key key of the route
   * @param params [Optional] parameters. for example route '/user/:id' will replace `:id` with the param passed.
   * @example
   * // Assuming there is a route {value: '/users/:id', params: {id:''}}
   * instance.path('users', {id: '122'}) // returns '/users/122'
   * instance.path('users') // returns '/users/:id'
   */
  path<Key extends K>(key: Key, params?: RouteType[Key]['params']) {
    if (params) {
      return this.pathParams(key, params);
    }

    if (typeof this._routes[key] === 'undefined') {
      throw new Error(`RouteGetterGenerator: Invalid Key: ${key}`);
    }

    return this._routes[key].value;
  }

  pathParams<Key extends keyof RouteType>(pathKey: Key, params: RouteType[Key]['params']) {
    let r = this._routes[pathKey];
    if (typeof r === 'undefined') {
      throw new Error(`RouteGetterGenerator: Invalid Key: ${pathKey}`);
    }
    return generatePath(r.value, params);
  }

  get keys() {
    return Object.keys(this._routes);
  }

  asArray(): RouteType[] {
    return Object.values(this._routes);
  }

  isRoute(key: keyof RouteType | string): key is keyof RouteType {
    return typeof this._routes[key as keyof RouteType] !== 'undefined';
  }
}
export default RouteGetterGenerator;
