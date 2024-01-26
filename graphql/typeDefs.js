const typeDefs = `#graphql
    interface Unique {
        id: ID!
    }

    type User implements Unique {
        id: ID!,
        email: String!,
    }

    type Project implements Unique {
        id: ID!,
        title: String!,
        description: String,
        manager: User!,
        colaborators: [User!]!,
        totalColaborators: Int!,
        complete: Boolean!,
        creator: User!,
    }

    type Theme implements Unique {
        id: ID!,
        creator: User!,
        project: Project!,
        title: String!,
        description: String,
        complete: Boolean!,
    }

    type TaskStep {
        title: String!,
        isCompleted: Boolean!,
    }
  
    interface Task {
        creator: User!,
        title: String!,
        description: String,
        notes: String,
        scheduledDate: String,
        category: String!,
        steps: [TaskStep!]!,
        completion: Int!,
        attachments: [String!]!,
        priority: String!,
        status: String!,
        dueDate: String!,
        late: Boolean!,
    }

    type PersonalTask implements Task & Unique {
        id: ID!,
        creator: User!,
        title: String!,
        description: String,
        notes: String,
        scheduledDate: String,
        category: String!,
        steps: [TaskStep!]!,
        completion: Int!,
        attachments: [String!]!,
        priority: String!,
        status: String!,
        dueDate: String!,
        late: Boolean!,
    }

    type ThemeTask implements Task & Unique {
        id: ID!,
        theme: Theme!,
        creator: User!,
        title: String!,
        description: String,
        notes: String,
        scheduledDate: String,
        category: String!,
        steps: [TaskStep!]!,
        completion: Int!,
        attachments: [String!]!,
        priority: String!,
        status: String!,
        dueDate: String!,
        late: Boolean!,
    }

    type ProjectTask implements Task & Unique {
        id: ID!,
        project: Project!,
        creator: User!,
        title: String!,
        description: String,
        notes: String,
        scheduledDate: String,
        category: String!,
        steps: [TaskStep!]!,
        completion: Int!,
        attachments: [String!]!,
        priority: String!,
        status: String!,
        dueDate: String!,
        late: Boolean!,
    }

    ###########################################

    # Interface for all the responses of query operations
    interface QueryResponse {
        # Either "success" or "fail"
        status: String!
    }

    interface MulitpleResultsResponse {
        # The number of total returned data 
        results: Int!,
    }

    # Response of Authentication Operations: login, signup, changePassword
    type AuthenticationQueryResponse implements QueryResponse {
        status: String!,
        # JWT for later authorization
        token: String,
        # User data if needed
        user: User,
    }

    # Response of User Operations: me
    type UserQueryResponse implements QueryResponse {
        status: String!,
        # User information
        email: String!,
        id: ID!,
        # Every project the user has created if needed
        projects: [Project!]
    }

    # Response of Project Operation
    type ProjectQueryResponse implements QueryResponse {
        status: String!,
        # User information
        project: Project,
    }

    # Response of Theme Operation
    type ThemeQueryResponse implements QueryResponse {
        status: String!,
        # User information
        theme: Theme,
    }

    type MultipleProjectsQueryResponse implements QueryResponse & MulitpleResultsResponse {
        status: String!,
        results: Int!,
        projects: [Project!]!,
    }

    type MulitpleThemesQueryResponse implements QueryResponse & MulitpleResultsResponse {
        status: String!,
        results: Int!,
        themes: [Theme!]!,
    }

    type MulitpleTasksQueryResponse implements QueryResponse & MulitpleResultsResponse {
        status: String!,
        results: Int!,
        tasks: [Task!]!,
    }

    ############################################

    # Interface for all the responses of mutate operations
    interface MutationResponse {
        # Either "success" or "fail"
        status: String!
    }

    # Response of User-related Operations
    type ChangePasswordMutationResponse {
        status: String!,
        passwordChangedAt: String!
    }
    
    # Response of Task-related Operations: updateTask
    type TaskMutationResponse implements MutationResponse {
        status: String!,
        task: Task,
    }

    # Response of Project-related Operations
    type ProjectMutationResponse implements MutationResponse {
        status: String!,
        project: Project,
    }

    # Response of Theme-related Operations
    type ThemeMutationResponse implements MutationResponse {
        status: String!,
        theme: Theme,
    }

    ##############################################

    # Type represents the query in the URL
    input FilterObjectInt {
        content: Int!
    }

    input FilterObjectString {
        content: String!
    }

    input FilterObject {
        field: FilterObjectString!,
        gt: FilterObjectInt,
        lt: FilterObjectInt,
        eqStr: FilterObjectString,
        eqNum: FilterObjectInt,
    }

    input RequestQueryObject {
        # The number of returned documents
        limit: Int,
        # The number of pages
        page: Int,
        # Sorting. For instance: "-createdAt,+dueDate"
        sort: String,
        # select only these fields. For instance: "dueDate,title,description"
        fields: String,
        # The remaining querying info. For instance, gt lt 
        others: [FilterObject!]
    }

    input UpdateOptions {
        add: Boolean
    }

    input ProjectUpdateObject {
        title: String,
        description: String,
        complete: Boolean,
        colaborators: [ID!],
        newManager: ID,
        options: UpdateOptions, 
    }

    input ThemeUpdateObject {
        title: String,
        description: String,
        complete: Boolean,
    }

    input ThemeCreateObject {
        title: String!,
        description: String
    }

    input ProjectCreateObject {
        title: String!,
        description: String,
        manager: ID!,
        colaborators: [ID!],
        themes: [ThemeCreateObject!]
    }

    type Query {
        me: UserQueryResponse!,
        project(projectId: ID!): ProjectQueryResponse!,
        projects(query: RequestQueryObject): MultipleProjectsQueryResponse!,
        themes(projectId: ID!, query: RequestQueryObject): MulitpleThemesQueryResponse!,
        theme(themeId: ID!, projectId: ID!): ThemeQueryResponse!,
        tasks(query: RequestQueryObject): MulitpleTasksQueryResponse!,
    }

    type Mutation {
        login(email: String!, password: String!): AuthenticationQueryResponse!,
        signup(email: String!, password: String!, passwordConfirm: String!): AuthenticationQueryResponse!,
        changePassword(currentPassword: String!, password: String!, passwordConfirm: String!): ChangePasswordMutationResponse!,
        createProject(body: ProjectCreateObject!): ProjectMutationResponse!,
        updateProject(projectId: ID!, body: ProjectUpdateObject!): ProjectMutationResponse!,
        # updateProjectMembers(projectId: ID!, body: ProjectMemberObject!): ProjectMutationResponse!,
        deleteProject(projectId: ID!): ProjectMutationResponse!,
        createTheme(projectId: ID!, body: ThemeCreateObject!): ThemeMutationResponse!,
        updateTheme(projectId:ID!, themeId: ID!, body: ThemeUpdateObject!): ThemeMutationResponse!,
        deleteTheme(projectId:ID!, themeId: ID!): ThemeMutationResponse!,
        updateTask(id: ID!): TaskMutationResponse!,
        deletePersonalTask(taskId: ID!): TaskMutationResponse!,
    }
`;

export default typeDefs;
