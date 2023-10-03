const version = 5;

const migrations = {
  [version]: (state: any) => {
    return {
      ...state,
      user: {
        ...state.user,
        loading: false,
        accessToken: null,
      },
    }
  },
};

export { migrations, version };