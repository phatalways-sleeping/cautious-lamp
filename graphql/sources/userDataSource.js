import { RESTDataSource } from "@apollo/datasource-rest";
import { GraphQLError } from "graphql";

export class UserDataSource extends RESTDataSource {
  baseURL = "http://127.0.0.1:3000/users";

  async me(token) {
    const response = await this.get(`/me`, {
      headers: this.headers(token),
    });

    if (response.status !== "success") {
      throw new GraphQLError("Unsuccessful requests", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }

    return response.data;
  }

  async changePassword(token, { currentPassword, password, passwordConfirm }) {
    const response = await this.patch(`/changePassword`, {
      headers: this.headers(token),
      body: {
        currentPassword,
        password,
        passwordConfirm,
      },
    });

    if (response.status !== "success") {
      throw new GraphQLError("Unsuccessful requests", {
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
        },
      });
    }

    return response.data;
  }

  headers({ token }) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
