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
  me: async (_, __, contextValue, ___) => {
    const { userAPI } = contextValue.dataSources;
    return userAPI.me();
  },
  project: async (_, args, contextValue, __) => {
    const { projectAPI } = contextValue.dataSources;
    const { projectId, query } = args;
    return projectAPI.getProject({
      projectId,
      query,
    });
  },
  projects: async (_, args, contextValue, __) => {
    const { projectAPI } = contextValue.dataSources;
    const { query } = args;
    return projectAPI.getProjects({
      query,
    });
  },
};

export default queriesResolvers;
