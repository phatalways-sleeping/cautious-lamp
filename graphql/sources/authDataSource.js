import { RESTDataSource } from "@apollo/datasource-rest";

export default class AuthDataSource extends RESTDataSource {
  baseURL = process.env.BASE_URL;

  async login({ email, password }) {
    const response = await this.post(`/api/v1/users/login`, {
      body: {
        email,
        password,
      },
    });

    return {
      status: "success",
      token: response.token,
      user: response.data.user,
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
      token: response.token,
      user: response.data.user,
    };
  }

  async forgetPassword(email) {
    const response = this.post("", {
      body: {
        email,
      },
    });
  }

  async resetPassword(resetToken, password, passwordConfirm) {
    const response = this.post("", {
      body: {
        resetToken,
        password,
        passwordConfirm,
      },
    });
  }
}
