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
            pageParam: prev.pageParam,
            pages: [
              {
                messages: [createMessages, ...prev.pages[0].messages],
              },
              ...prev.pages.slice(1),
            ],
          };
        });
      },
    }
  );
};

const findTargetMsgIdx = (data, id) => {
  let msgIndex = -1;
  const pageIndex = data.pages.findIndex(({ messages }) => {
    msgIndex = messages.findIndex((msg) => msg.id === id);
    if (msgIndex > -1) {
      return true;
    }
    return false;
  });

  return {
    pageIndex,
    msgIndex,
  };
};

export const useUpdateMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ text, id, userId }) => fetcher(UPDATE_MESSAGE, { text, id, userId }),
    {
      onSuccess: ({ updateMessages }) => {
        queryClient.setQueryData(["MESSAGES"], (prev) => {
          const { pageIndex, msgIndex } = findTargetMsgIdx(
            prev,
            updateMessages.id
          );
          if (pageIndex < 0 || msgIndex < 0) {
            return prev;
          }
          const newPages = [...prev.pages];
          newPages[pageIndex] = { messages: [...newPages[pageIndex].messages] };
          newPages[pageIndex].messages.splice(msgIndex, 1, updateMessages);
          return {
            pageParam: prev.pageParam,
            pages: newPages,
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
          const { pageIndex, msgIndex } = findTargetMsgIdx(prev, deletedId);
          if (pageIndex < 0 || msgIndex < 0) {
            return prev;
          }
          const newPages = [...prev.pages];
          newPages[pageIndex] = { messages: [...newPages[pageIndex].messages] };
          newPages[pageIndex].messages.splice(msgIndex, 1);
          return {
            pageParam: prev.pageParam,
            pages: newPages,
          };
        });
      },
    }
  );
};
