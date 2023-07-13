import React, { useState } from "react";
import * as E from "fp-ts/lib/Either";

const MDEditor = React.lazy(() => import("@uiw/react-md-editor"));

import { createEventMotion, updateEventMotion } from "api/events";
import { BuildableMotion, MotionUpdates } from "interfaces/motion";
import {
  ActionFunctionArgs,
  Form,
  LoaderFunctionArgs,
  json,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { eventMotionLoader } from "./EventMotionRoute";
import { CrumbDataFn } from "components/Crumb";

interface EditEventMotionRouteProps {
  newMotion?: boolean;
}

export async function newEventMotionLoader({ params }: LoaderFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const newMotion: BuildableMotion = {
    title: "",
    description: "",
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
    description: formData.get("description") as string,
  };

  const createEventMotionTask = createEventMotion(eventId, buildableMotion);

  const motionEither = await createEventMotionTask();

  if (E.isLeft(motionEither)) {
    throw motionEither.left;
  }

  const motion = motionEither.right;

  return redirect(`/events/${eventId}/motions/${motion.id}`);
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
    description: formData.get("description") as string,
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

  const motion = motionEither.right;

  return redirect(`/events/${eventId}/motions/${motion.id}`);
}

export const NewEventMotionCrumb: CrumbDataFn = () => {
  return { label: "Add motion" };
};

export const EditEventMotionCrumb: CrumbDataFn = (match) => {
  const data = match.data as Awaited<ReturnType<typeof editEventMotionLoader>>;
  return { label: `Edit motion: ${data.title}` };
};

const EditEventMotionRoute: React.FC<EditEventMotionRouteProps> = ({
  newMotion,
}) => {
  const navigate = useNavigate();
  const motion = useLoaderData() as Awaited<
    ReturnType<typeof editEventMotionLoader>
  >;
  const [descriptionValue, setDescriptionValue] = useState<string>(
    motion.description
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

      <div className="flex flex-row gap-4">
        <button type="submit" className="btn-accent btn max-w-xs">
          {newMotion ? "Create motion" : "Update motion"}
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

export default EditEventMotionRoute;
