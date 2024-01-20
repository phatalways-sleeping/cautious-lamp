const queriesResolvers = {
  login: async (_, args, contextValue, __) => {
    const { email, password } = args;
    const { authAPI } = contextValue.dataSources;
    return authAPI.login({
      email,
      password,
    });
  },
  signup: async (_, args, contextValue, __) => {
    const { email, password, passwordConfirm } = args;
    const { authAPI } = contextValue.dataSources;
    return authAPI.signup({
      email,
      password,
      passwordConfirm,
    });
  },
};

export default queriesResolvers;
