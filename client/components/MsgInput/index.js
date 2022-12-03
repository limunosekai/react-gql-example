import { useRef } from "react";

const MsgInput = ({ id = "", text = "", mutate = () => {} }) => {
  const textRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = textRef.current.value;
    textRef.current.value = "";
    mutate({ text, id });
  };

  return (
    <form className="messages__input" onSubmit={handleSubmit}>
      <textarea
        ref={textRef}
        placeholder="내용 입력하시오.."
        defaultValue={text}
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default MsgInput;
