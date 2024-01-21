import queriesResolvers from "./queries.js";
import mutationsResolvers from "./mutations.js";

const resolvers = {
  Query: queriesResolvers,
  Mutation: mutationsResolvers,
};

export default resolvers;
