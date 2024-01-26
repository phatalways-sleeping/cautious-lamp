import { RESTDataSource } from "@apollo/datasource-rest";
import constructHeaders from "../utils/constructHeaders.js";
import constructQueryString from "../utils/constructQueryString.js";

export default class ThemeDataSource extends RESTDataSource {
  constructor({ cache, token }) {
    super({ cache });
    this.token = token;
  }

  baseURL = process.env.BASE_URL;

  async createTheme({ projectId, body }) {
    const response = await this.post(
      `/api/v1/users/projects/${projectId}/themes`,
      {
        headers: constructHeaders({ token: this.token }),
        body
      }
    );

    return {
      status: "success",
      theme: response.data,
    };
  }

  async getThemes({ projectId, query }) {
    const queryString = constructQueryString(query);
    const response = await this.get(
      `/api/v1/users/projects/${projectId}/themes?${queryString}`,
      {
        headers: constructHeaders({ token: this.token }),
      }
    );

    return {
      status: "success",
      results: response.results,
      themes: response.data.data,
    };
  }

  async getTheme({ themeId, projectId }) {
    const response = await this.get(
      `/api/v1/users/projects/${projectId}/themes/${themeId}`,
      {
        headers: constructHeaders({ token: this.token }),
      }
    );

    return {
      status: "success",
      theme: response.data,
    };
  }

  async updateTheme({ themeId, projectId, body }) {
    const response = await this.put(
      `/api/v1/users/projects/${projectId}/themes/${themeId}`,
      {
        headers: constructHeaders({ token: this.token }),
        body,
      }
    );

    return {
      status: "success",
      theme: response.data,
    };
  }

  async deleteTheme({ themeId, projectId }) {
    await this.delete(`/api/v1/users/projects/${projectId}/themes/${themeId}`, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      theme: null,
    };
  }
}
