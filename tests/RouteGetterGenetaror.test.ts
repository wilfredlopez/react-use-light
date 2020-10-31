import { RouteGetterGenerator, RouterGetterRecord } from '../src/index';
type RouteKeys = 'home' | 'profile';

interface MyRouteType extends RouterGetterRecord<RouteKeys> {
  home: {
    value: string;
  };
  profile: {
    value: string;
    params: {
      id: string;
    };
  };
}

const routes: MyRouteType = {
  home: {
    value: '/',
  },
  profile: {
    value: '/profile/:id',
    params: {
      id: '',
    },
  },
};

//Creating Instance
const appRoutes = new RouteGetterGenerator<RouteKeys, MyRouteType>(routes);

describe('RouteGetterGenerator', () => {
  it('Returns the correct path', () => {
    const homePath = appRoutes.path('home');
    expect(homePath).toBe(routes.home.value);
  });
  it('path is type safe', () => {
    //@ts-expect-error
    expect(() => appRoutes.path('nopath')).toThrow('Invalid Key: nopath');
  });
  it('returns the path with the params', () => {
    const id = '123';
    const profileRoute = appRoutes.path('profile', { id: id });
    const profileRouteParams = appRoutes.pathParams('profile', { id: id });
    const expected = `/profile/${id}`;
    expect(profileRoute).toBe(expected);
    expect(profileRouteParams).toBe(expected);
  });
  it('returns the routes and an array of routes', () => {
    const rs = appRoutes.routes;
    expect(rs.home.value).toBe(routes.home.value);
    const arr = appRoutes.asArray();
    expect(Array.isArray(arr)).toBeTruthy();
  });
});
