import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { MsgInput, MsgItem } from "..";
import fetcher from "../../fetcher";

const MsgList = () => {
  const {
    query: { userId = "" },
  } = useRouter();
  const [mockMsgs, setMockMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      const msgs = await fetcher("get", "/messages");
      setMockMsgs(msgs);
    };
    getMessages();
  }, []);

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

  if (mockMsgs.length === 0) {
    return null;
  }

  return (
    <>
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
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
