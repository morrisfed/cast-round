import React, { useState } from "react";
import * as E from "fp-ts/lib/Either";

const MDEditor = React.lazy(() => import("@uiw/react-md-editor"));

import {
  ActionFunctionArgs,
  Form,
  Link,
  LoaderFunctionArgs,
  redirect,
  useLoaderData,
} from "react-router-dom";
import { BuildableEvent, EventUpdates } from "interfaces/event";
import { createEvent, updateEvent } from "events/event-service";
import { eventLoader } from "./EventRoute";
import { CrumbDataFn } from "components/Crumb";

export async function newEventLoader() {
  const newEvent: BuildableEvent = {
    name: "",
    description: "",
    fromDate: new Date(),
    toDate: new Date(),
  };
  return Promise.resolve(newEvent);
}

export async function editEventLoader(args: LoaderFunctionArgs) {
  return eventLoader(args);
}

export async function newEventAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const fromDateString = formData.get("fromDate") as string;
  const toDateString = formData.get("toDate") as string;

  const fromDate = new Date(fromDateString);
  const toDate = new Date(toDateString);

  const createEventTask = createEvent(name, description, fromDate, toDate);

  const createdEventEither = await createEventTask();
  if (E.isLeft(createdEventEither)) {
    throw createdEventEither.left;
  } else {
    const createdEvent = createdEventEither.right;
    return redirect(`/events/${createdEvent.id}`);
  }
}

export async function editEventAction({ params, request }: ActionFunctionArgs) {
  const eventId = params.eventId;
  if (!eventId) {
    throw new Error("No event ID provided");
  }

  const formData = await request.formData();

  const fromDateString = formData.get("fromDate") as string;
  const toDateString = formData.get("toDate") as string;

  const fromDate = new Date(fromDateString);
  const toDate = new Date(toDateString);

  const eventUpdates: EventUpdates = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    fromDate,
    toDate,
  };

  const updateEventTask = updateEvent(eventId, eventUpdates);

  const eventEither = await updateEventTask();

  if (E.isLeft(eventEither)) {
    throw eventEither.left;
  }

  return redirect(`/events/${eventId}`);
}

export const NewEventCrumb: CrumbDataFn = () => {
  return { label: "New event" };
};

export const EditEventCrumb: CrumbDataFn = (match) => {
  const data = match.data as Awaited<ReturnType<typeof editEventLoader>>;
  return { label: `Edit event: ${data.name}` };
};

const lPadZero = (targetLength: number, numStr: string) =>
  numStr.padStart(targetLength, "0");
const lPad2Digit = (num: number) => lPadZero(2, num.toString());
const lPad4Digit = (num: number) => lPadZero(4, num.toString());

const dateAsDateTimeInputString = (date: Date) =>
  `${lPad4Digit(date.getFullYear())}-${lPad2Digit(
    date.getMonth() + 1
  )}-${lPad2Digit(date.getDate())}T${lPad2Digit(date.getHours())}:${lPad2Digit(
    date.getMinutes()
  )}`;

const EditEventRoute: React.FC = () => {
  const event = useLoaderData() as Awaited<ReturnType<typeof editEventLoader>>;

  const [nameValue, setNameValue] = useState<string>(event.name);
  const [descriptionValue, setDescriptionValue] = useState<string>(
    event.description
  );
  const [fromDateValue, setFromDateValue] = useState<string>(
    dateAsDateTimeInputString(event.fromDate)
  );
  const [toDateValue, setToDateValue] = useState<string>(
    dateAsDateTimeInputString(event.toDate)
  );

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
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          className="input-bordered input"
        />

        <label className="label">
          <span className="label-text">From date</span>
        </label>
        <input
          name="fromDate"
          type="datetime-local"
          value={fromDateValue}
          onChange={(e) => setFromDateValue(e.target.value)}
        />

        <label className="label">
          <span className="label-text">To date</span>
        </label>
        <input
          name="toDate"
          type="datetime-local"
          value={toDateValue}
          onChange={(e) => setToDateValue(e.target.value)}
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

      <button type="submit" className="btn-outline btn-accent btn max-w-xs">
        Save event
      </button>
      <Link to=".." className="btn max-w-xs">
        Cancel
      </Link>
    </Form>
  );
};

export default EditEventRoute;
