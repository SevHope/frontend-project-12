const apiPath = '/api/v1';

export default {
  loginPath: () => [apiPath, 'login'].join('/'),
  usersPath: () => [apiPath, 'data'].join('/'),
  channelsPath: () => [apiPath, 'channels'].join('/'),
  loginPagePath: () => '/login',
  chatPagepath: () => '/chat',
};
