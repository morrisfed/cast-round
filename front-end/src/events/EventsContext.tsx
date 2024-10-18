import React, { useContext, useEffect, useState } from "react";
import { getEvents, registerEventsChangedListener } from "./event-service";
import { Event } from "interfaces/event";

export type IEventsContext = {
  events: readonly Event[];
};

const contextUninitialisedSymbol = Symbol();

const EventsContext = React.createContext<
  IEventsContext | typeof contextUninitialisedSymbol
>(contextUninitialisedSymbol);

const EventsContextProvider = ({ children }: { children: JSX.Element }) => {
  const [events, setEvents] = useState<readonly Event[]>([]);

  useEffect(() => {
    // Set up a listener for event changes, and use the returned Event collection in case the event service
    // has already fetched and cached the events.
    setEvents(registerEventsChangedListener(setEvents));

    // Trigger the events service to fetch events if is has not done so already.
    getEvents();
  }, []);

  return (
    <EventsContext.Provider
      value={{
        events,
      }}
    >
      {children}
    </EventsContext.Provider>
  );
};

const useEvents = () => {
  const currentContextValue = useContext(EventsContext);
  if (currentContextValue === contextUninitialisedSymbol) {
    throw new Error("useEvents must be used within an EventsContextProvider");
  }
  return currentContextValue.events;
};

export { EventsContextProvider, useEvents };
