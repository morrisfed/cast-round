import React, { useState } from "react";
import * as E from "fp-ts/lib/Either";

const MDEditor = React.lazy(() => import("@uiw/react-md-editor"));


import { ActionFunctionArgs, Form, redirect } from "react-router-dom";
import { createEvent } from "api/events";

export async function createEventAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const fromDateString = formData.get("fromDate") as string;
  const toDateString = formData.get("toDate") as string;

  const createEventTask = createEvent(
    name,
    description,
    fromDateString,
    toDateString
  );

  const createdEventEither = await createEventTask();
  if (E.isLeft(createdEventEither)) {
    throw createdEventEither.left;
  } else {
    const createdEvent = createdEventEither.right;
    return redirect(`/events/${createdEvent.id}`);
  }
}

const NewEvent: React.FC = () => {
  const [descriptionValue, setDescriptionValue] = useState<string>("");

  return (
    <Form method="POST" className="flex flex-col gap-2">
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          name="name"
          type="text"
          placeholder="Name"
          className="input-bordered input"
        />

        <label className="label">
          <span className="label-text">From date</span>
        </label>
        <input name="fromDate" type="date" />

        <label className="label">
          <span className="label-text">To date</span>
        </label>
        <input name="toDate" type="date" />
      </div>

      <div>
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <React.Suspense fallback={<div>Loading...</div>} >
          <MDEditor
            value={descriptionValue}
            onChange={(value) => setDescriptionValue(value ?? "")}
          />
        </React.Suspense>
        <input name="description" type="hidden" value={descriptionValue} />
      </div>

      <button type="submit" className="btn-outline btn-accent btn max-w-xs">
        Create event
      </button>
    </Form>
  );
};

export default NewEvent;
