import * as E from "fp-ts/lib/Either";

import MDEditor from "@uiw/react-md-editor";
import { createEventVote, updateEventVote } from "api/events";
import { BuildableVote, VoteUpdates } from "interfaces/vote";
import { useState } from "react";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  json,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { eventVoteLoader } from "./EventVoteRoute";
import { CrumbDataFn } from "components/Crumb";

interface EditEventVoteRouteProps {
  newVote?: boolean;
}

export async function newEventVoteLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const newVote: BuildableVote = {
    title: "",
    description: "",
  };

  return json(newVote);
}

export async function editEventVoteLoader(args: LoaderFunctionArgs) {
  return eventVoteLoader(args);
}

export async function createEventVoteAction({
  params,
  request,
}: ActionFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const formData = await request.formData();

  const buildableVote: BuildableVote = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  };

  const createEventVoteTask = createEventVote(eventId, buildableVote);

  const voteEither = await createEventVoteTask();

  if (E.isLeft(voteEither)) {
    throw voteEither.left;
  }

  const vote = voteEither.right;

  return redirect(`/events/${eventId}/votes/${vote.id}`);
}

export async function updateEventVoteAction({
  params,
  request,
}: ActionFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const voteId = params.voteId;
  if (!voteId) {
    throw new Error("No vote ID provided");
  }

  const formData = await request.formData();

  const voteUpdates: VoteUpdates = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  };

  const updateEventVoteTask = updateEventVote(eventId, voteId, voteUpdates);

  const voteEither = await updateEventVoteTask();

  if (E.isLeft(voteEither)) {
    throw voteEither.left;
  }

  const vote = voteEither.right;

  return redirect(`/events/${eventId}/votes/${vote.id}`);
}

export const NewEventVoteCrumb: CrumbDataFn = () => {
  return { label: "Add vote" };
};

export const EditEventVoteCrumb: CrumbDataFn = (match) => {
  const data = match.data as Awaited<ReturnType<typeof editEventVoteLoader>>;
  return { label: `Edit vote: ${data.title}` };
};

const EditEventVoteRoute: React.FC<EditEventVoteRouteProps> = ({ newVote }) => {
  const navigate = useNavigate();
  const vote = useLoaderData() as Awaited<
    ReturnType<typeof editEventVoteLoader>
  >;
  const [descriptionValue, setDescriptionValue] = useState<string>(
    vote.description
  );

  return (
    <Form method="POST" className="flex flex-col gap-2">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Title</span>
        </label>
        <input
          name="title"
          type="text"
          placeholder="Title"
          className="input-bordered input"
          defaultValue={vote.title}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <MDEditor
          value={descriptionValue}
          onChange={(value) => setDescriptionValue(value ?? "")}
        />
        <input name="description" type="hidden" value={descriptionValue} />
      </div>

      <div className="flex flex-row gap-4">
        <button type="submit" className="btn-accent btn max-w-xs">
          {newVote ? "Create vote" : "Update vote"}
        </button>

        <button
          type="button"
          className="btn-outline btn"
          onClick={() => {
            navigate(-1);
          }}
        >
          Cancel
        </button>
      </div>
    </Form>
  );
};

export default EditEventVoteRoute;
