import { RESTDataSource } from "@apollo/datasource-rest";
import constructQueryString from "../utils/constructQueryString";
import constructHeaders from "../utils/constructHeaders";

export default class TaskDataSource extends RESTDataSource {
  constructor({ cache, token }) {
    super({ cache });
    this.token = token;
  }

  baseURL = process.env.BASE_URL;

  async getTasks(query) {
    const queryString = query ? constructQueryString(query) : "";

    const response = await this.get(`/api/v1/users/tasks?${queryString}`, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      results: response.results,
      tasks: response.data.data,
    };
  }

  async getTask({ taskId }) {
    const response = await this.get(`/api/v1/users/tasks/${taskId}`, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      tasks: response.data,
    };
  }

  async deletePersonalTask({ taskId }) {
    await this.delete(`/api/v1/users/tasks/${taskId}`, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      tasks: null,
    };
  }
}
