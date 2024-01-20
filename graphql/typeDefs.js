export const typeDefs = `#graphql
    interface Unique {
        id: ID!
    }

    type User implements Unique {
        id: ID!,
        email: String!,
    }

    type Project implements Unique {
        id: ID!,

    }

    type Theme implements Unique {
        id: ID!,

    }
  
    interface Task {
        title: String!,
        description: String,
        notes: String,
    }

    type PersonalTask implements Task & Unique {
        id: ID!,
        title: String!,
        description: String,
        notes: String,
    }

    type ThemeTask implements Task & Unique {
        id: ID!,
        title: String!,
        description: String,
        notes: String,
    }

    type ProjectTask implements Task & Unique {
        id: ID!,
        title: String!,
        description: String,
        notes: String,
    }

    ###########################################

    type Payload {
        token: String,
        user: User
    }

    interface Response {
        status: String!,
    }

    type AuthResponse implements Response {
        status: String!,
        data: Payload,
    }

    type Query {
        login(email: String!, password: String!): AuthResponse!,
        signup(email: String!, password: String!, passwordConfirm: String!): AuthResponse!,
    }

    type Mutation {
        updateTask(id: ID!): Payload!,
    }
`;
