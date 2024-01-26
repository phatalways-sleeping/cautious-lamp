import { RESTDataSource } from "@apollo/datasource-rest";
import { GraphQLError } from "graphql";
import constructQueryString from "../utils/constructQueryString.js";
import constructHeaders from "../utils/constructHeaders.js";

function constructTaskEndpoint({
  taskId,
  projectId,
  themeId,
  queryString,
  type,
}) {
  let endpoint = `/api/v1/users/`;
  if (type === "project") {
    if (!projectId) {
      throw new GraphQLError("projectId is not given when type is project", {
        extensions: {
          code: "BAD_USER_INPUT",
        },
      });
    }
    endpoint += `projects/${projectId}/tasks`;
  } else if (type === "theme") {
    if (!projectId || !themeId) {
      throw new GraphQLError(
        "projectId or themeId is not given when type is theme",
        {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        }
      );
    }
    endpoint += `projects/${projectId}/themes/${themeId}/tasks`;
  } else {
    endpoint += `tasks`;
  }

  if (taskId) {
    endpoint += `/${taskId}`;
  }

  if (queryString) {
    endpoint += `?${queryString}`;
  }

  return endpoint;
}

export default class TaskDataSource extends RESTDataSource {
  constructor({ cache, token }) {
    super({ cache });
    this.token = token;
  }

  baseURL = process.env.BASE_URL;

  async createTask({ type, body, taskObject }) {
    const info = body ?? {};
    const endpoint = constructTaskEndpoint({ type, ...info });

    const response = await this.post(endpoint, {
      headers: constructHeaders({ token: this.token }),
      body: taskObject,
    });

    return {
      status: "success",
      task: response.data,
    };
  }

  async getTasks({ type, query }) {
    const queryString = query ? constructQueryString(query) : "";

    const endpoint = constructTaskEndpoint({ queryString, type });

    const response = await this.get(endpoint, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      results: response.results,
      tasks: response.data.data,
    };
  }

  async getTask({ type, body }) {
    const endpoint = constructTaskEndpoint({ type, ...body });
    const response = await this.get(endpoint, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      task: response.data,
    };
  }

  async updateTask({ type, body, updateObject }) {
    const endpoint = constructTaskEndpoint({ type, ...body });
    const response = await this.put(endpoint, {
      headers: constructHeaders({ token: this.token }),
      body: updateObject,
    });

    return {
      status: "success",
      task: response.data,
    };
  }

  async deleteTask({ type, body }) {
    const endpoint = constructTaskEndpoint({ type, ...body });
    await this.delete(endpoint, {
      headers: constructHeaders({ token: this.token }),
    });

    return {
      status: "success",
      tasks: null,
    };
  }
}
