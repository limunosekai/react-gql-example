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
  user,
}) => {
  const handleDelete = () => {
    onDelete({ id, userId });
  };

  return (
    <li className="messages__item">
      <h3>
        {user?.nickname || ""}
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
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </li>
  );
};

export default MsgItem;
