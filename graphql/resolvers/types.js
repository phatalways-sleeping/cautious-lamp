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
      return projectAPI.getProject({ projectId: project }).then((response) => response.project);
    },
  },
};

export default typeResolvers;
