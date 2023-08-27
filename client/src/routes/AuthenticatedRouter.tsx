import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import ErrorPage from "../components/Error";
import Root from "routes/Root";
import Account, { AccountCrumb, accountLoader } from "routes/Account";
import Accounts, { AccountsCrumb, accountsLoader } from "routes/Accounts";
import UploadAccounts, {
  uploadAccountsAction,
  UploadAccountsCrumb,
} from "routes/UploadAccounts";
import AdminIndexRoute from "routes/AdminIndexRoute";
import Events, { EventsCrumb } from "routes/EventsRoute";
import { EventCrumb, eventLoader } from "routes/EventRoute";
import EditEventMotion, {
  createEventMotionAction,
  EditEventMotionCrumb,
  editEventMotionLoader,
  NewEventMotionCrumb,
  newEventMotionLoader,
  updateEventMotionAction,
} from "routes/EditEventMotionRoute";
import AdminRoute, { AdminCrum } from "routes/AdminRoute";
import EventsIndexRoute, { eventsLoader } from "routes/EventsIndexRoute";
import EventIndexRoute, {
  createEventUserAction,
  eventIndexLoader,
} from "routes/EventIndexRoute";
import { EventMotionCrumb, eventMotionLoader } from "routes/EventMotionRoute";
import EventMotionIndexRoute, {
  eventMotionAction,
} from "routes/EventMotionIndexRoute";
import { useUserProfile } from "../components/UserProfileContext";
import EditEventRoute, {
  editEventAction,
  EditEventCrumb,
  editEventLoader,
  newEventAction,
  NewEventCrumb,
  newEventLoader,
} from "./EditEventRoute";

const AuthenticatedRouter: React.FC = () => {
  const profile = useUserProfile();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root />}>
        <Route errorElement={<ErrorPage />}>
          <Route path="accounts" handle={{ crumb: AccountsCrumb }}>
            <Route index element={<Accounts />} loader={accountsLoader} />
            <Route
              path=":accountId"
              element={<Account />}
              loader={accountLoader}
              handle={{ crumb: AccountCrumb }}
            />
          </Route>

          <Route
            path="events"
            element={<Events />}
            handle={{ crumb: EventsCrumb }}
          >
            <Route index element={<EventsIndexRoute />} loader={eventsLoader} />

            <Route
              path="new"
              element={<EditEventRoute />}
              loader={newEventLoader}
              action={newEventAction}
              handle={{ crumb: NewEventCrumb }}
            />

            <Route
              path=":eventId"
              loader={eventLoader}
              handle={{ crumb: EventCrumb }}
            >
              <Route
                index
                element={<EventIndexRoute />}
                loader={(args) => eventIndexLoader(profile, args)}
                action={(args) => createEventUserAction(profile, args)}
              />

              <Route
                path="edit"
                element={<EditEventRoute />}
                loader={editEventLoader}
                action={editEventAction}
                handle={{ crumb: EditEventCrumb }}
              ></Route>

              <Route
                path="new"
                element={<EditEventMotion />}
                loader={newEventMotionLoader}
                action={createEventMotionAction}
                handle={{ crumb: NewEventMotionCrumb }}
              />

              <Route
                path=":motionId"
                handle={{ crumb: EventMotionCrumb }}
                loader={eventMotionLoader}
              >
                <Route
                  index
                  element={<EventMotionIndexRoute />}
                  loader={eventMotionLoader}
                  action={(args) => eventMotionAction(profile, args)}
                />
                1
                <Route
                  path="edit"
                  element={<EditEventMotion />}
                  loader={editEventMotionLoader}
                  action={updateEventMotionAction}
                  handle={{ crumb: EditEventMotionCrumb }}
                ></Route>
              </Route>
            </Route>
          </Route>

          <Route
            path="admin"
            element={<AdminRoute />}
            handle={{ crumb: AdminCrum }}
          >
            <Route index element={<AdminIndexRoute />} />
            <Route
              path="uploadAccounts"
              element={<UploadAccounts />}
              action={uploadAccountsAction}
              handle={{ crumb: UploadAccountsCrumb }}
            />
          </Route>
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default AuthenticatedRouter;
