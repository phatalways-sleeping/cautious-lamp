const typeDefs = `#graphql

    type User {

    }

    type Project {

    }

    type Theme {

    }
  
    interface Task {

    }

    type PersonalTask implements Task {

    }

    type ThemeTask implements Task {

    }

    type ProjectTask implements Task {

    }

    type Query {
        user(id: ID): User,
        projects(userId: ID): [Project!]!
        project(userId: ID, projectId: ID): Project
    }

    type Mutation {

    }
`;

export default typeDefs;
