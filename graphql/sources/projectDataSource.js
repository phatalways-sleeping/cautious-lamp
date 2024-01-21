import { RESTDataSource } from "@apollo/datasource-rest";
import constructHeaders from "../utils/constructHeaders.js";
import constructQueryString from "../utils/constructQueryString.js";

export default class ProjectDataSource extends RESTDataSource {
  constructor({ cache, token }) {
    super({ cache });
    this.token = token;
  }

  baseURL = process.env.BASE_URL;

  async getProject({ projectId, query }) {
    const queryString = query ? constructQueryString(query) : "";

    const response = await this.get(
      `/api/v1/users/projects/${projectId}?${queryString}`,
      {
        headers: constructHeaders({ token: this.token }),
      }
    );

    const project =
      Object.keys(response.data).length === 0 ? null : response.data;

    return {
      status: "success",
      project,
    };
  }

  async getProjects({ query }) {
    const queryString = query ? constructQueryString(query) : "";

    const response = await this.get(
      `/api/v1/users/projects?${queryString}`,
      {
        headers: constructHeaders({ token: this.token }),
      }
    );

    const projects =
      Object.keys(response.data).length === 0 ? null : response.data;

    return {
      status: "success",
      projects,
    };
  }
}
