import { RESTDataSource } from "@apollo/datasource-rest";
import constructHeaders from "../utils/constructHeaders.js";
import constructQueryString from "../utils/constructQueryString.js";

export default class ProjectDataSource extends RESTDataSource {
  constructor({ cache, token }) {
    super({ cache });
    this.token = token;
  }

  baseURL = process.env.BASE_URL;

  async getProject({ projectId }) {
    // const queryString = query ? constructQueryString(query) : "";

    const response = await this.get(
      `/api/v1/users/projects/${projectId}`,
      {
        headers: constructHeaders({ token: this.token }),
      }
    );

    // const project =
    //   Object.keys(response.data).length === 0 ? null : response.data;

    return {
      status: "success",
      project: response.data,
    };
  }

  async getProjects({ query }) {
    const queryString = query ? constructQueryString(query) : "";

    const response = await this.get(`/api/v1/users/projects?${queryString}`, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      results: response.results,
      projects: response.data.data,
    };
  }

  async updateProject({ id, body }) {
    const colaboratorsInput = body.others;
    delete body.others;
    const response = await this.put(`/api/v1/users/projects/${id}`, {
      headers: constructHeaders({ token: this.token }),
      body,
    });

    if (colaboratorsInput) {
      const result = await this.updateProjectMembers({
        projectId: id,
        body: colaboratorsInput,
      });
      return result;
    }

    return {
      status: "success",
      project: response.data,
    };
  }

  async updateProjectMembers({ projectId, body }) {
    const response = await this.patch(
      `/api/v1/users/projects/${projectId}/colaborators`,
      {
        headers: constructHeaders({ token: this.token }),
        body,
      }
    );

    return {
      status: "success",
      project: response.data,
    };
  }

  async createProject({ body }) {
    const response = await this.post(`/api/v1/users/projects`, {
      headers: constructHeaders({ token: this.token }),
      body,
    });

    return {
      status: "success",
      project: response.data,
    };
  }

  async deleteProject({ projectId }) {
    await this.delete(`/api/v1/users/projects/${projectId}`, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      project: null,
    };
  }
}
