import queriesResolvers from "./queries.js";
import mutationsResolvers from "./mutations.js";
import typeResolvers from "./types.js";

const resolvers = {
  Query: queriesResolvers,
  Mutation: mutationsResolvers,
  ...typeResolvers,
};

export default resolvers;
