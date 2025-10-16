// Auth action creators
export const signoutAction = () => ({
  type: 'AUTH_SIGNOUT',
  payload: null,
});

export const signinAction = (user: unknown) => ({
  type: 'AUTH_SIGNIN',
  payload: user,
});
