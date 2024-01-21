import { GraphQLError } from "graphql";

export default function extractToken(headers) {
  const { authorization } = headers;
  if (!authorization) return null;
  if (!authorization.startsWith("Bearer ")) {
    throw new GraphQLError("Invalid authorization format", {
      extensions: {
        code: "AUTHORIZATION_MALFORM",
        http: {
          code: 401,
        },
      },
    });
  }
  const token = authorization.split("Bearer ")[1];
  return token;
}
