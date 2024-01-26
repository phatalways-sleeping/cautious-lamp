const typeResolvers = {
  Project: {
    colaborators: async (parent, _, contextValue, __) => {
      const { colaborators } = parent;
      const { userAPI } = contextValue.dataSources;
      return Promise.all(colaborators.map((id) => userAPI.getUser({ id })));
    },
    manager: async (parent, _, contextValue, __) => {
      const { manager } = parent;
      const { userAPI } = contextValue.dataSources;
      return userAPI.getUser({ id: manager });
    },
    creator: async (parent, _, contextValue, __) => {
      const { creator } = parent;
      const { userAPI } = contextValue.dataSources;
      return userAPI.getUser({ id: creator });
    },
    totalColaborators: (parent) => parent.colaborators.length,
  },
  Theme: {
    creator: async (parent, _, contextValue, __) => {
      const { creator } = parent;
      const { userAPI } = contextValue.dataSources;
      return userAPI.getUser({ id: creator });
    },
    project: async (parent, _, contextValue, __) => {
      const { project } = parent;
      const { projectAPI } = contextValue.dataSources;
      return projectAPI
        .getProject({ projectId: project })
        .then((response) => response.project);
    },
  },
  PersonalTask: {
    creator: async (parent, _, contextValue, __) => {
      const { creator } = parent;
      const { userAPI } = contextValue.dataSources;
      return userAPI.getUser({ id: creator });
    },
  },
  ProjectTask: {
    creator: async (parent, _, contextValue, __) => {
      const { creator } = parent;
      const { userAPI } = contextValue.dataSources;
      return userAPI.getUser({ id: creator });
    },
    project: async (parent, _, contextValue, __) => {
      const { project } = parent;
      const { projectAPI } = contextValue.dataSources;
      return projectAPI
        .getProject({ projectId: project })
        .then((response) => response.project);
    },
    assignee: async (parent, _, contextValue, __) => {
      const { assignee } = parent;
      const { userAPI } = contextValue.dataSources;
      return userAPI.getUser({ id: assignee });
    },
  },
  ThemeTask: {
    creator: async (parent, _, contextValue, __) => {
      const { creator } = parent;
      const { userAPI } = contextValue.dataSources;
      return userAPI.getUser({ id: creator });
    },
    theme: async (parent, _, contextValue, __) => {
      const { project, theme } = parent;
      const { themeAPI } = contextValue.dataSources;
      return themeAPI
        .getTheme({ projectId: project, themeId: theme })
        .then((response) => response.theme);
    },
    assignee: async (parent, _, contextValue, __) => {
      const { assignee } = parent;
      const { userAPI } = contextValue.dataSources;
      return userAPI.getUser({ id: assignee });
    },
  },
  TaskUnion: {
    __resolveType: (parent) => {
      if (parent.project && parent.theme) {
        return "ThemeTask";
      }
      if (parent.project) {
        return "ProjectTask";
      }
      return "PersonalTask";
    },
  },
};

export default typeResolvers;
