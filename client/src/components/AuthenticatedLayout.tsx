import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { UserProfile } from "interfaces/user";
import ErrorPage from "./Error";
import Root from "routes/Root";
import Account, { AccountCrumb, accountLoader } from "routes/Account";
import Accounts, { AccountsCrumb, accountsLoader } from "routes/Accounts";
import Delegates, { delegatesLoader } from "routes/Delegates";
import UploadAccounts, {
  uploadAccountsAction,
  UploadAccountsCrumb,
} from "routes/UploadAccounts";
import AdminIndexRoute from "routes/AdminIndexRoute";
import NewAccountDelegate, {
  createAccountDelegateAction,
} from "routes/NewAccountDelegate";
import AccountDelegates, {
  accountDelegatesLoader,
} from "routes/AccountDelegates";
import Events, { EventsCrumb } from "routes/EventsRoute";
import NewEvent, { createEventAction } from "routes/NewEvent";
import { EventCrumb, eventLoader } from "routes/EventRoute";
import EditEventVote, {
  createEventVoteAction,
  EditEventVoteCrumb,
  editEventVoteLoader,
  NewEventVoteCrumb,
  newEventVoteLoader,
  updateEventVoteAction,
} from "routes/EditEventVoteRoute";
import AdminRoute, { AdminCrum } from "routes/AdminRoute";
import EventsIndexRoute, { eventsLoader } from "routes/EventsIndexRoute";
import EventIndexRoute, { eventIndexLoader } from "routes/EventIndexRoute";
import { EventVoteCrumb, eventVoteLoader } from "routes/EventVoteRoute";
import EventVoteIndexRoute from "routes/EventVoteIndexRoute";

const AuthenticatedLayout: React.FC = () => {
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
            >
              <Route
                index
                element={<AccountDelegates />}
                loader={accountDelegatesLoader}
              />
            </Route>
          </Route>

          <Route
            path="accounts/:accountId/newdelegate"
            element={<NewAccountDelegate />}
            action={createAccountDelegateAction}
          />

          <Route
            path="delegates"
            element={<Delegates />}
            loader={delegatesLoader}
          />

          <Route
            path="events"
            element={<Events />}
            handle={{ crumb: EventsCrumb }}
          >
            <Route index element={<EventsIndexRoute />} loader={eventsLoader} />
            <Route
              path=":eventId"
              loader={eventLoader}
              handle={{ crumb: EventCrumb }}
            >
              <Route
                index
                element={<EventIndexRoute />}
                loader={eventIndexLoader}
              />

              <Route path="votes">
                <Route
                  path="newvote"
                  element={<EditEventVote />}
                  loader={newEventVoteLoader}
                  action={createEventVoteAction}
                  handle={{ crumb: NewEventVoteCrumb }}
                />
                <Route
                  path=":voteId"
                  handle={{ crumb: EventVoteCrumb }}
                  loader={eventVoteLoader}
                >
                  <Route
                    index
                    element={<EventVoteIndexRoute />}
                    loader={eventVoteLoader}
                  />
                  <Route
                    path="edit"
                    element={<EditEventVote />}
                    loader={editEventVoteLoader}
                    action={updateEventVoteAction}
                    handle={{ crumb: EditEventVoteCrumb }}
                  ></Route>
                </Route>
              </Route>
            </Route>
          </Route>

          <Route
            path="events/newevent"
            element={<NewEvent />}
            action={createEventAction}
          />

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

export default AuthenticatedLayout;
