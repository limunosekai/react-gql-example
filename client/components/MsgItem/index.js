import MsgInput from "../MsgInput";

const MsgItem = ({
  id,
  userId,
  text,
  timestamp,
  onUpdate,
  isEditing = false,
  onStartEdit,
  onDelete,
  myId,
}) => {
  return (
    <li className="messages__item">
      <h3>
        {userId}
        <sub>
          {new Date(timestamp).toLocaleString("ko-KR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </sub>
      </h3>
      {isEditing ? (
        <>
          <MsgInput mutate={onUpdate} id={id} text={text} />
        </>
      ) : (
        text
      )}
      {myId === userId && (
        <div className="messages__buttons">
          <button onClick={onStartEdit}>Edit</button>
          <button onClick={onDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default MsgItem;
