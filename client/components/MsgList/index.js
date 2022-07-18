import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import useIntersection from "../../hooks/useInfiniteScroll";
import { MsgInput, MsgItem } from "..";
import fetcher from "../../fetcher";

const MsgList = ({ smsgs, users }) => {
  const ref = useRef(null);
  const {
    query: { userId = "" },
  } = useRouter();
  const intersecting = useIntersection(ref);
  const [mockMsgs, setMockMsgs] = useState(smsgs);
  const [editingId, setEditingId] = useState(null);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const getMessages = async () => {
    setIsLoading(true);
    const newMsgs = await fetcher("get", "/messages", {
      params: { cursor: mockMsgs[mockMsgs.length - 1]?.id || "" },
    });
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMockMsgs((prev) => [...prev, ...newMsgs]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (intersecting && intersecting.isIntersecting && hasNext && !isLoading) {
      getMessages();
    }
  }, [intersecting?.isIntersecting, hasNext, isLoading]);

  const handleCreate = async (text) => {
    const newMsg = await fetcher("post", "/messages", { text, userId });
    if (!newMsg) {
      return;
    }
    setMockMsgs((prev) => [newMsg, ...prev]);
  };

  const handleUpdate = async (text, id) => {
    const newMsg = await fetcher("put", `/messages/${id}`, { text, userId });
    if (!newMsg) {
      return;
    }
    setMockMsgs((prev) => {
      const targetIndex = mockMsgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) {
        return prev;
      }
      const newMsgs = [...prev];
      newMsgs.splice(targetIndex, 1, newMsg);
      return newMsgs;
    });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    const deletedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    if (!deletedId) {
      return;
    }
    setMockMsgs((prev) => {
      const targetIndex = mockMsgs.findIndex((msg) => +msg.id === +deletedId);
      if (targetIndex < 0) {
        return prev;
      }
      const newMsgs = [...prev];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  return (
    <main>
      {userId && <MsgInput mutate={handleCreate} />}
      <ul className="messages">
        {mockMsgs?.map((item) => (
          <MsgItem
            key={item.id}
            {...item}
            onUpdate={handleUpdate}
            isEditing={editingId === item.id}
            onStartEdit={() => setEditingId(item.id)}
            onDelete={() => handleDelete(item.id)}
            myId={userId}
            user={users[item.userId]}
          />
        ))}
      </ul>
      <div ref={ref} style={{ border: "1px solid white" }} />
    </main>
  );
};

export default MsgList;
