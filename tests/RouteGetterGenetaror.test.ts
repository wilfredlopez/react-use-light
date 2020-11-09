import { RouteGetterGenerator, RouterGetterRecord } from '../src/index';
type RouteKeys = 'home' | 'profile' | 'other';

const routes: RouterGetterRecord<RouteKeys> = {
  home: {
    value: '/',
  },
  profile: {
    value: '/profile/:id',
    params: {
      id: '',
    },
  },
  other: {
    value: '/other/:id/:key',
    params: {
      id: '',
      key: '',
    },
  },
};

//Creating Instance
const appRoutes = new RouteGetterGenerator<RouteKeys>(routes);

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

  it.skip('doesnt thow error with empty string as param', () => {
    expect(() => appRoutes.path('profile', { id: '' })).not.toThrow();
  });
  it('can handle multiple params', () => {
    const id = 'myid';
    const key = 'mykey';
    const other = appRoutes.path('other', { id: id, key: key });
    expect(other).toBe(`/other/${id}/${key}`);
  });
  it('gets the root path', () => {
    const other = appRoutes.rootPath('other');
    expect(other).toBe('/other');
  });
});
