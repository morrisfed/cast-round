import { getEvent } from "api/events";
import * as E from "fp-ts/lib/Either";

import ReactMarkdown from "react-markdown";
import { LoaderFunctionArgs, Outlet, useLoaderData } from "react-router-dom";

export async function eventLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const getEventTask = getEvent(eventId);

  const eventEither = await getEventTask();

  if (E.isLeft(eventEither)) {
    throw eventEither.left;
  }

  return eventEither.right;
}

const Event: React.FC = () => {
  const event = useLoaderData() as Awaited<ReturnType<typeof eventLoader>>;

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{event.name}</h2>
        <p>{event.name}</p>
        <div className="card-actions justify-end">
          <button className="btn-primary btn">Buy Now</button>
        </div>
      </div>
    </div>

    // <div>
    //   <h1>Event</h1>
    //   <p>Event ID: {event.id}</p>
    //   <p>Name: {event.name}</p>
    //   <p>From: {event.fromDate.toString()}</p>
    //   <p>To: {event.toDate.toString()}</p>
    //   <p>Description:</p>
    //   <article className="prose">
    //     <ReactMarkdown>{event.description}</ReactMarkdown>
    //   </article>
    //   <Outlet />
    // </div>
  );
};

export default Event;
