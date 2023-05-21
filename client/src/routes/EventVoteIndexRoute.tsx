import { useLoaderData } from "react-router-dom";
import { Vote } from "interfaces/vote";
import VoteDetails from "components/Vote/VoteDetails";
import { eventVoteLoader } from "./EventVoteRoute";

const EventVoteIndexRoute: React.FC = () => {
  const vote: Vote = useLoaderData() as Awaited<
    ReturnType<typeof eventVoteLoader>
  >;

  return <VoteDetails vote={vote} />;
};

export default EventVoteIndexRoute;
