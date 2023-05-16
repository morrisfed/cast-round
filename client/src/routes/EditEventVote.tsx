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
} from "react-router-dom";
import { eventVoteLoader } from "./EventVote";

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

const EditEventVote: React.FC = () => {
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

      <button type="submit" className="btn-outline btn-accent btn max-w-xs">
        Create vote
      </button>
    </Form>
  );
};

export default EditEventVote;
