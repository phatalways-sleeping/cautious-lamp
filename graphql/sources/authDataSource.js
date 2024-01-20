import { RESTDataSource } from "@apollo/datasource-rest";
import { GraphQLError } from "graphql";

export class AuthDataSource extends RESTDataSource {
  baseURL = "http://localhost:3000";

  async login({ email, password }) {
    const response = await this.post(`/api/v1/users/login`, {
      body: {
        email,
        password,
      },
    });

    return {
      status: "success",
      data: { token: response.token },
    };
  }

  async signup({ email, password, passwordConfirm }) {
    const response = await this.post(`/api/v1/users/signup`, {
      body: {
        email,
        password,
        passwordConfirm,
      },
    });

    return {
      status: "success",
      data: {
        token: response.token,
        user: { email: response.data.user.email, id: response.data.user.id },
      },
    };
  }

  async forgetPassword(email) {}

  async resetPassword(resetToken, password, passwordConfirm) {}
}
