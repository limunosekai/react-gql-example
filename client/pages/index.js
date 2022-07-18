import { MsgList } from "../components";
import fetcher from "../fetcher";

const Home = ({ smsgs, users }) => {
  return (
    <>
      <div>HOME</div>
      <MsgList smsgs={smsgs} users={users} />
    </>
  );
};

export const getServerSideProps = async () => {
  const smsgs = await fetcher("get", "/messages");
  const users = await fetcher("get", "/users");

  return {
    props: {
      smsgs,
      users,
    },
  };
};

export default Home;
