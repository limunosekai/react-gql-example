import { gql } from "graphql-tag";

export const GET_MESSAGES = gql`
  query GET_MESSAGES($cursor: ID) {
    messages(cursor: $cursor) {
      id
      text
      userId
      timestamp
      user {
        id
        nickname
      }
    }
  }
`;

export const GET_MESSAGE = gql`
  query GET_MESSAGE($id: ID!) {
    message(id: $id) {
      id
      text
      timestamp
      user {
        id
        nickname
      }
    }
  }
`;

export const CREATE_MESSAGE = gql`
  mutation CREATE_MESSAGE($text: String!, $userId: ID!) {
    createMessages(text: $text, userId: $userId) {
      id
      text
      timestamp
      user {
        id
        nickname
      }
    }
  }
`;

export const UPDATE_MESSAGE = gql`
  mutation UPDATE_MESSAGE($id: ID!, $text: String!, $userId: ID!) {
    updateMessages(id: $id, text: $text, userId: $userId) {
      id
      text
      timestamp
      user {
        id
        nickname
      }
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DELETE_MESSAGE($id: ID!, $userId: ID!) {
    deleteMessages(id: $id, userId: $userId)
  }
`;
