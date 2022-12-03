import { request } from "graphql-request";
import { useInfiniteQuery, useMutation, useQueryClient } from "react-query";
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
  UPDATE_MESSAGE,
} from "./graphql/message";

const BASE_URL = "http://localhost:8000/graphql";

export const fetcher = (query, variables = {}) =>
  request(BASE_URL, query, variables);

export const useMessagesQuery = () => {
  return useInfiniteQuery(
    ["MESSAGES"],
    ({ pageParam = "" }) => fetcher(GET_MESSAGES, { cursor: pageParam }),
    {
      getNextPageParam: ({ messages }) => {
        return messages?.[messages.length - 1]?.id ?? undefined;
      },
    }
  );
};

export const useCreateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ text, id }) => fetcher(CREATE_MESSAGE, { text, userId: id }),
    {
      onSuccess: ({ createMessages }) => {
        queryClient.setQueryData(["MESSAGES"], (prev) => {
          return {
            messages: [createMessages, ...prev.messages],
          };
        });
      },
    }
  );
};

export const useUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ text, id, userId }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessages }) => {
        queryClient.setQueryData(["MESSAGES"], (prev) => {
          const targetIndex = prev.messages.findIndex(
            (msg) => msg.id === updateMessages.id
          );
          if (targetIndex < 0) {
            return prev;
          }
          const newMsgs = [...prev.messages];
          newMsgs.splice(targetIndex, 1, updateMessages);
          return {
            messages: newMsgs,
          };
        });
      },
    }
  );
};

export const useDeleteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ id, userId }) => fetcher(DELETE_MESSAGE, { id, userId }),
    {
      onSuccess: ({ deleteMessages: deletedId }) => {
        queryClient.setQueryData(["MESSAGES"], (prev) => {
          const targetIndex = prev.messages.findIndex(
            (msg) => msg.id === deletedId
          );
          if (targetIndex < 0) {
            return prev;
          }
          const newMsgs = [...prev.messages];
          newMsgs.splice(targetIndex, 1);
          return {
            messages: newMsgs,
          };
        });
      },
    }
  );
};
