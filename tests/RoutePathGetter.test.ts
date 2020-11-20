import { RoutePathGetter } from '../src/index';

const routes = {
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
const appRoutes = new RoutePathGetter(routes);

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
    const profileRoute = appRoutes.path('profile', { params: { id: id } });
    const profileRouteParams = appRoutes.pathParams('profile', { params: { id: id } });
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

  it('doesnt thow error with empty string as param', () => {
    expect(() => appRoutes.path('profile', { params: { id: '' } })).not.toThrow();
  });
  it('can handle multiple params', () => {
    const id = 'myid';
    const key = 'mykey';
    const other = appRoutes.path('other', { params: { id: id, key: key } });
    expect(other).toBe(`/other/${id}/${key}`);
  });
  it('gets the root path', () => {
    const other = appRoutes.rootPath('other');
    expect(other).toBe('/other');
  });
});
