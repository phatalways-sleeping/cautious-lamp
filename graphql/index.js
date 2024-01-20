import { startStandaloneServer } from "@apollo/server/standalone";
import dotenv from "dotenv";
import { UserDataSource } from "./sources/userDataSource.js";
import { AuthDataSource } from "./sources/authDataSource.js";
import server from "./server.js";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message, err.stack);
  console.log("UNCAUGHT EXCEPTION");
  process.exit(1);
});

dotenv.config({
  path: "./config.env",
});

const port = process.env.PORT || 4000;

const { url } = await startStandaloneServer(server, {
  listen: { port },
  context: async ({ req, _ }) => {
    const { token } = req;
    const { cache } = server;
    const userAPI = new UserDataSource({ cache });
    const authAPI = new AuthDataSource({ cache });
    return {
      token: token,
      dataSources: {
        userAPI,
        authAPI,
      },
    };
  },
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message, err.stack);
  console.log("UNHANDLED REJECTION");
  process.exit(1);
});

console.log(`🚀  Server ready at: ${url}`);
