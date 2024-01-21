import { ApolloServer } from "@apollo/server";
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
  formatError: (formattedError, error) => {
    const logger = new ErrorLogger(formattedError, error, {
      debugMode,
    });
    return logger.format();
  },
});

export default server;
