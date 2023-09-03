import React, { useCallback, useState } from "react";
import * as E from "fp-ts/lib/Either";

const MDEditor = React.lazy(() => import("@uiw/react-md-editor"));

import {
  BuildableMotion,
  ModelVoteDefinition,
  MotionUpdates,
} from "interfaces/motion";
import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  json,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { eventMotionLoader } from "./EventMotionRoute";
import { CrumbDataFn } from "components/Crumb";
import { createEventMotion, updateEventMotion } from "events/event-service";
import MotionVoteDefinition from "components/Motion/MotionVoteDefinition";

export async function newEventMotionLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const newMotion: BuildableMotion = {
    title: "",
    sequence: 0,
    description: "",
    voteDefinition: {
      definitionSchemaVersion: 1,
      roleVotes: [],
      responses: [],
    },
  };

  return json(newMotion);
}

export async function editEventMotionLoader(args: LoaderFunctionArgs) {
  return eventMotionLoader(args);
}

export async function createEventMotionAction({
  params,
  request,
}: ActionFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const formData = await request.formData();

  const buildableMotion: BuildableMotion = {
    title: formData.get("title") as string,
    sequence: parseInt(formData.get("sequence") as string),
    description: formData.get("description") as string,
    voteDefinition: JSON.parse(formData.get("voteDefinition") as string),
  };

  const createEventMotionTask = createEventMotion(eventId, buildableMotion);

  const motionEither = await createEventMotionTask();

  if (E.isLeft(motionEither)) {
    throw motionEither.left;
  }

  return redirect(`..`);
}

export async function updateEventMotionAction({
  params,
  request,
}: ActionFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const motionId = params.motionId;
  if (!motionId) {
    throw new Error("No motion ID provided");
  }

  const formData = await request.formData();

  const motionUpdates: MotionUpdates = {
    title: formData.get("title") as string,
    sequence: parseInt(formData.get("sequence") as string),
    description: formData.get("description") as string,
    voteDefinition: JSON.parse(formData.get("voteDefinition") as string),
  };

  const updateEventMotionTask = updateEventMotion(
    eventId,
    motionId,
    motionUpdates
  );

  const motionEither = await updateEventMotionTask();

  if (E.isLeft(motionEither)) {
    throw motionEither.left;
  }

  return redirect("..");
}

export const NewEventMotionCrumb: CrumbDataFn = () => {
  return { label: "Add motion" };
};

export const EditEventMotionCrumb: CrumbDataFn = (match) => {
  const data = match.data as Awaited<ReturnType<typeof editEventMotionLoader>>;
  return { label: `Edit motion: ${data.title}` };
};

const EditEventMotionRoute: React.FC = () => {
  const motion = useLoaderData() as Awaited<
    ReturnType<typeof editEventMotionLoader>
  >;
  const [descriptionValue, setDescriptionValue] = useState<string>(
    motion.description
  );

  const [voteDefinition, setVoteDefinition] = useState<ModelVoteDefinition>(
    motion.voteDefinition
  );

  const voteDefinitionChangedHandler = useCallback(
    (updatedVoteDefinition: ModelVoteDefinition) => {
      setVoteDefinition(updatedVoteDefinition);
    },
    [setVoteDefinition]
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
          defaultValue={motion.title}
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Sequence</span>
        </label>
        <input
          name="sequence"
          type="number"
          placeholder="Sequence"
          className="input-bordered input"
          defaultValue={motion.sequence}
        />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <React.Suspense fallback={<div>Loading...</div>}>
          <MDEditor
            value={descriptionValue}
            onChange={(value) => setDescriptionValue(value ?? "")}
          />
        </React.Suspense>
        <input name="description" type="hidden" value={descriptionValue} />
      </div>

      <MotionVoteDefinition
        voteDefinition={voteDefinition}
        onDefinitionChanged={voteDefinitionChangedHandler}
      />
      <input
        type="hidden"
        name="voteDefinition"
        value={JSON.stringify(voteDefinition)}
      />

      <div className="flex flex-row gap-4">
        <button type="submit" className="btn-accent btn max-w-xs">
          Save motion
        </button>

        <Link to=".." className="btn max-w-xs">
          Cancel
        </Link>
      </div>
    </Form>
  );
};

export default EditEventMotionRoute;
