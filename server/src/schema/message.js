import { gql } from "apollo-server-express";

const messageSchema = gql`
  type Message {
    id: ID!
    text: String!
    userId: ID!
    timestamp: Float
  }

  extend type Query {
    messages(cursor: ID): [Message!]!
    message(id: ID!): Message!
  }

  extend type Mutation {
    createMessages(text: String!, userId: ID!): Message!
    updateMessages(id: ID!, text: String!, userId: ID!): Message!
    deleteMessages(id: ID!, userId: ID!): ID!
  }
`;

export default messageSchema;
