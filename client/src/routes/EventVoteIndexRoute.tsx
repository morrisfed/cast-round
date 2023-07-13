import { useLoaderData } from "react-router-dom";
import { Motion } from "interfaces/motion";
import VoteDetails from "components/Vote/VoteDetails";
import { eventVoteLoader } from "./EventVoteRoute";

const EventVoteIndexRoute: React.FC = () => {
  const vote: Motion = useLoaderData() as Awaited<
    ReturnType<typeof eventVoteLoader>
  >;

  return <VoteDetails vote={vote} />;
};

export default EventVoteIndexRoute;
