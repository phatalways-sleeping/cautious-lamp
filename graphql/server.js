import { ApolloServer } from "@apollo/server";
import { InMemoryLRUCache } from "@apollo/utils.keyvaluecache";
import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers/resolvers.js";

import ErrorLogger from "./utils/errorLogger.js";

let debugMode = true;

if (process.env.NODE_ENV.trim() === "prod") {
  debugMode = false;
  console.log("You are in production mode!");
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: debugMode,
  cache: new InMemoryLRUCache({
    maxSize: 2 ** 20 * 100,
    ttl: 300 * 1000,
  }),
  formatError: (formattedError, error) => {
    const logger = new ErrorLogger(formattedError, error, {
      debugMode,
    });
    return logger.format();
  },
});

export default server;
