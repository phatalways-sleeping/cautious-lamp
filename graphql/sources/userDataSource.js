import { RESTDataSource } from "@apollo/datasource-rest";
import constructHeaders from "../utils/constructHeaders.js";

export default class UserDataSource extends RESTDataSource {
  constructor({ cache, token }) {
    super({ cache });
    this.token = token;
  }

  baseURL = process.env.BASE_URL;

  async me() {
    const response = await this.get(`/api/v1/users/me`, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      ...response.data,
    };
  }

  async changePassword({ currentPassword, password, passwordConfirm }) {
    const response = await this.patch(`/api/v1/users/changePassword`, {
      headers: constructHeaders({ token: this.token }),
      body: {
        currentPassword,
        password,
        passwordConfirm,
      },
    });

    return {
      status: "success",
      passwordChangedAt: response.data.user.passwordChangedAt,
    };
  }
}
