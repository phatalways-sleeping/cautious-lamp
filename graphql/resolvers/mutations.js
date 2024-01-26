const mutationsResolvers = {
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
  changePassword: async (_, args, contextValue, __) => {
    const { currentPassword, password, passwordConfirm } = args;
    const { userAPI } = contextValue.dataSources;
    return userAPI.changePassword({
      currentPassword,
      password,
      passwordConfirm,
    });
  },
  updateProject: async (_, args, contextValue, __) => {
    const { projectId, body } = args;
    const { projectAPI } = contextValue.dataSources;
    return projectAPI.updateProject({ id: projectId, body });
  },
  // updateProjectMembers: async (_, args, contextValue, __) => {
  //   const { projectId, body } = args;
  //   const { projectAPI } = contextValue.dataSources;
  //   return projectAPI.updateProjectMembers({ projectId, body });
  // },
  createProject: async (_, args, contextValue, __) => {
    const { body } = args;
    const { projectAPI } = contextValue.dataSources;
    return projectAPI.createProject({ body });
  },
  deleteProject: async (_, args, contextValue, __) => {
    const { projectId } = args;
    const { projectAPI } = contextValue.dataSources;
    return projectAPI.deleteProject({ projectId });
  },
  createTheme: async (_, args, contextValue, __) => {
    const { projectId, body } = args;
    const { themeAPI } = contextValue.dataSources;
    return themeAPI.createTheme({ projectId, body });
  },
  updateTheme: async (_, args, contextValue, __) => {
    const { themeId, projectId, body } = args;
    const { themeAPI } = contextValue.dataSources;
    return themeAPI.updateTheme({ themeId, projectId, body });
  },
  deleteTheme: async (_, args, contextValue, __) => {
    const { projectId, themeId } = args;
    const { themeAPI } = contextValue.dataSources;
    return themeAPI.deleteTheme({ themeId, projectId });
  },
  createTask: async (_, args, contextValue, __) => {
    const { type, body, taskObject } = args;
    const { taskAPI } = contextValue.dataSources;
    return taskAPI.createTask({ type, body, taskObject });
  },
  updateTask: async (_, args, contextValue, __) => {
    const { type, body, updateObject } = args;
    const { taskAPI } = contextValue.dataSources;
    return taskAPI.updateTask({ type, body, updateObject });
  },
  deleteTask: async (_, args, contextValue, __) => {
    const { type, body } = args;
    const { taskAPI } = contextValue.dataSources;
    return taskAPI.deleteTask({ type, body });
  },
};

export default mutationsResolvers;
