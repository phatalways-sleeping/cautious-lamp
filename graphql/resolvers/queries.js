const queriesResolvers = {
  me: async (_, __, contextValue, ___) => {
    const { userAPI } = contextValue.dataSources;
    return userAPI.me();
  },
  project: async (_, args, contextValue, __) => {
    const { projectAPI } = contextValue.dataSources;
    const { projectId } = args;
    return projectAPI.getProject({
      projectId,
    });
  },
  projects: async (_, args, contextValue, __) => {
    const { projectAPI } = contextValue.dataSources;
    const { query } = args;
    return projectAPI.getProjects({
      query,
    });
  },
  themes: async (_, args, contextValue, __) => {
    const { themeAPI } = contextValue.dataSources;
    const { projectId, query } = args;
    return themeAPI.getThemes({
      projectId,
      query,
    });
  },
  theme: async (_, args, contextValue, __) => {
    const { themeAPI } = contextValue.dataSources;
    const { projectId, themeId } = args;
    return themeAPI.getTheme({
      projectId,
      themeId,
    });
  },
  task: async (_, args, contextValue, __) => {
    const { taskAPI } = contextValue.dataSources;
    const { query, type, body } = args;
    return taskAPI.getTask({
      query,
      type,
      body,
    });
  },
  tasks: async (_, args, contextValue, __) => {
    const { taskAPI } = contextValue.dataSources;
    const { type, query } = args;
    return taskAPI.getTasks({
      type,
      query,
    });
  },
};

export default queriesResolvers;
