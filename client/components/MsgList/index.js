import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useIntersection from "../../hooks/useInfiniteScroll";
import { MsgInput, MsgItem } from "..";
import {
  useCreateMutation,
  useDeleteMutation,
  useMessagesQuery,
  useUpdateMutation,
} from "../../queryClient";

const MsgList = ({ smsgs, users }) => {
  const ref = useRef(null);
  const {
    query: { userId = "" },
  } = useRouter();
  const { data, isLoading, fetchNextPage, hasNextPage } = useMessagesQuery();
  const { mutate: onUpdate } = useUpdateMutation();
  const { mutate: onCreate } = useCreateMutation();
  const { mutate: onDelete } = useDeleteMutation();

  const intersecting = useIntersection(ref);
  const [mockMsgs, setMockMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (data?.pages) {
      const mergedMessages = data.pages.flatMap((d) => d.messages);
      setMockMsgs(mergedMessages);
    }
  }, [data?.pages]);

  useEffect(() => {
    if (
      intersecting &&
      intersecting.isIntersecting &&
      hasNextPage &&
      !isLoading
    ) {
      fetchNextPage();
    }
  }, [intersecting?.isIntersecting, hasNextPage, isLoading]);

  const handleUpdate = ({ text, id }) => {
    onUpdate({ text, id, userId });
    setEditingId(null);
  };

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <main>
      {userId && <MsgInput userId={userId} mutate={onCreate} />}
      <ul className="messages">
        {mockMsgs?.map((item) => (
          <MsgItem
            key={item.id}
            {...item}
            onUpdate={handleUpdate}
            isEditing={editingId === item.id}
            onStartEdit={() => setEditingId(item.id)}
            onDelete={onDelete}
            myId={userId}
            user={users.find((user) => user.id === userId)}
          />
        ))}
      </ul>
      <div ref={ref} style={{ border: "1px solid white" }} />
    </main>
  );
};

export default MsgList;
