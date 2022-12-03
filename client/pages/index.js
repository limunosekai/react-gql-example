import { MsgList } from "../components";
import { fetcher } from "../queryClient";
import { GET_MESSAGES } from "../graphql/message";

const Home = ({ smsgs }) => {
  return (
    <>
      <div>HOME</div>
      <MsgList smsgs={smsgs} />
    </>
  );
};

export const getServerSideProps = async () => {
  const { messages: smsgs } = await fetcher(GET_MESSAGES);

  return {
    props: {
      smsgs,
    },
  };
};

export default Home;
