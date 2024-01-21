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
        manager: ID!,
        colaborators: [User!]!,
        complete: Boolean!
    }

    type Theme implements Unique {
        id: ID!,
        creator: ID!,
    }
  
    interface Task {
        creator: ID!,
        title: String!,
        description: String,
        notes: String,
    }

    type PersonalTask implements Task & Unique {
        id: ID!,
        creator: ID!,
        title: String!,
        description: String,
        notes: String,
    }

    type ThemeTask implements Task & Unique {
        id: ID!,
        creator: ID!,
        title: String!,
        description: String,
        notes: String,
    }

    type ProjectTask implements Task & Unique {
        id: ID!,
        creator: ID!,
        title: String!,
        description: String,
        notes: String,
    }

    ###########################################

    # Interface for all the responses of query operations
    interface QueryResponse {
        # Either "success" or "fail"
        status: String!
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

    type MultipleProjectsQueryResponse implements QueryResponse {
        status: String!,
        # User information
        projects: [Project!],
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
    type TaskUpdateMutationResponse implements MutationResponse {
        status: String!
    }

    ##############################################

    # Type represents the query in the URL
    input ObjectFilterInt {
        content: Int!
    }

    input ObjectFilterString {
        content: String!
    }

    input ObjectFilter {
        field: ObjectFilterString!,
        gt: ObjectFilterInt,
        lt: ObjectFilterInt,
        eqStr: ObjectFilterString,
        eqNum: ObjectFilterInt,
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
        others: [ObjectFilter!]
    }

    type Query {
        login(email: String!, password: String!): AuthenticationQueryResponse!,
        signup(email: String!, password: String!, passwordConfirm: String!): AuthenticationQueryResponse!,
        me: UserQueryResponse!,
        project(projectId: ID!, query: RequestQueryObject): ProjectQueryResponse!,
        projects(query: RequestQueryObject): MultipleProjectsQueryResponse!
    }

    type Mutation {
        changePassword(currentPassword: String!, password: String!, passwordConfirm: String!): ChangePasswordMutationResponse!,
        updateTask(id: ID!): TaskUpdateMutationResponse!,
    }
`;

export default typeDefs;
