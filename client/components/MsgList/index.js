import { useState, useEffect } from "react";
import { MsgInput, MsgItem } from "..";

const MsgList = () => {
  const userIds = ["roy", "joy"];
  const getRandomUserId = () => userIds[Math.round(Math.random())];
  const [mockMsgs, setMockMsgs] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const temp = Array(50)
      .fill(0)
      .map((_, i) => ({
        id: i + 1,
        userId: getRandomUserId(),
        timestamp: 1234567890123 + i * 1000 * 60,
        text: `${i + 1} mock text`,
      }))
      .reverse();
    setMockMsgs(temp);
  }, []);

  const handleCreate = (text) => {
    const newMsg = {
      id: mockMsgs.length + 2,
      userId: getRandomUserId(),
      timestamp: Date.now(),
      text: `${mockMsgs.length} ${text}`,
    };
    setMockMsgs((prev) => [newMsg, ...prev]);
  };

  const handleUpdate = (text, id) => {
    setMockMsgs((prev) => {
      const targetIndex = mockMsgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) {
        return prev;
      }
      const newMsgs = [...prev];
      newMsgs.splice(targetIndex, 1, {
        ...prev[targetIndex],
        text,
      });
      return newMsgs;
    });
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setMockMsgs((prev) => {
      const targetIndex = mockMsgs.findIndex((msg) => msg.id === id);
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
      <MsgInput mutate={handleCreate} />
      <ul className="messages">
        {mockMsgs?.map((item) => (
          <MsgItem
            key={item.id}
            {...item}
            onUpdate={handleUpdate}
            isEditing={editingId === item.id}
            onStartEdit={() => setEditingId(item.id)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;
