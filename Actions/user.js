const UserAction = {
  set: (token, dispatch) =>
    dispatch({
      type: 'user/set',
      payload: {
        token,
      },
    }),

  logout: dispatch =>
    dispatch({
      type: 'user/logout',
    }),

  updateUser(user) {
    return {
      type: 'user/update',
      payload: {
        user,
      },
    };
  },
};
export default UserAction;
