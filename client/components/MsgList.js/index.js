import { useState, useEffect } from "react";
import MsgItem from "../MsgItem";

const MsgList = () => {
  const userIds = ["roy", "joy"];
  const getRandomUserId = () => userIds[Math.round(Math.random())];
  const [mockMsgs, setMockMsgs] = useState([]);

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

  if (mockMsgs.length === 0) {
    return null;
  }

  return (
    <ul className="messages">
      {mockMsgs?.map((item) => (
        <MsgItem key={item.id} {...item} />
      ))}
    </ul>
  );
};

export default MsgList;
