import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
// import useIntersection from "../../hooks/useInfiniteScroll";
import { MsgInput, MsgItem } from "..";
import fetcher, {
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
  const { data, isLoading } = useMessagesQuery();
  const { mutate: onUpdate } = useUpdateMutation();
  const { mutate: onCreate } = useCreateMutation();
  const { mutate: onDelete } = useDeleteMutation();

  // const intersecting = useIntersection(ref);
  const [mockMsgs, setMockMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);
  // const [hasNext, setHasNext] = useState(true);
  // const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data?.messages && data?.messages.length > 0) {
      console.log("messages changed!!");
      setMockMsgs(data?.messages);
    }
  }, [data?.messages]);

  // useEffect(() => {
  //   if (intersecting && intersecting.isIntersecting && hasNext && !isLoading) {
  //     getMessages();
  //   }
  // }, [intersecting?.isIntersecting, hasNext, isLoading]);

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
