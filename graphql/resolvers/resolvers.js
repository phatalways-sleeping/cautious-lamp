import queriesResolvers from "./queries";
import mutationsResolvers from "./mutations";

const resolvers = {
    Query: queriesResolvers,
    Mutation: mutationsResolvers,
}

export default resolvers;