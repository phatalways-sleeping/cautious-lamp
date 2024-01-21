const mutationsResolvers = {
  changePassword: async (_, args, contextValue, __) => {
    const { currentPassword, password, passwordConfirm } = args;
    const { userAPI } = contextValue.dataSources;
    return userAPI.changePassword({
      currentPassword,
      password,
      passwordConfirm,
    });
  },
};

export default mutationsResolvers;
