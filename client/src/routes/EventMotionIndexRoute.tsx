import { useLoaderData } from "react-router-dom";
import { Motion } from "interfaces/motion";
import MotionDetails from "components/Motion/MotionDetails";
import { eventMotionLoader } from "./EventMotionRoute";

const EventMotionIndexRoute: React.FC = () => {
  const motion: Motion = useLoaderData() as Awaited<
    ReturnType<typeof eventMotionLoader>
  >;

  return <MotionDetails motion={motion} />;
};

export default EventMotionIndexRoute;
