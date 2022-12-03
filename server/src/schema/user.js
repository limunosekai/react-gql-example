import { gql } from "apollo-server-express";

const userSchema = gql`
  type User {
    id: ID!
    nickname: String!
  }

  extend type Query {
    user(id: ID!): User
    users: [User!]!
  }
`;

export default userSchema;
