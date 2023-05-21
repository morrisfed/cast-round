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
import Events, { eventsLoader } from "routes/Events";
import NewEvent, { createEventAction } from "routes/NewEvent";
import Event, { eventLoader } from "routes/Event";
import EventVotes, { eventVotesLoader } from "routes/EventVotes";
import EditEventVote, {
  createEventVoteAction,
  editEventVoteLoader,
  newEventVoteLoader,
  updateEventVoteAction,
} from "routes/EditEventVote";
import EventVote, { eventVoteLoader } from "routes/EventVote";
import AdminRoute, { AdminCrum } from "routes/AdminRoute";

export interface AuthenticatedLayoutProps {
  profile: UserProfile;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  profile,
}) => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root profile={profile} />}>
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

          <Route path="events">
            <Route index element={<Events />} loader={eventsLoader} />
            <Route path=":eventId" element={<Event />} loader={eventLoader}>
              <Route index element={<EventVotes />} loader={eventVotesLoader} />
            </Route>
          </Route>

          <Route
            path="events/newevent"
            element={<NewEvent />}
            action={createEventAction}
          />

          <Route
            path="/events/:eventId/newvote"
            element={<EditEventVote />}
            loader={newEventVoteLoader}
            action={createEventVoteAction}
          />

          <Route
            path="/events/:eventId/votes/:voteId"
            element={<EventVote />}
            loader={eventVoteLoader}
          ></Route>

          <Route
            path="/events/:eventId/votes/:voteId/edit"
            element={<EditEventVote />}
            loader={editEventVoteLoader}
            action={updateEventVoteAction}
          ></Route>

          <Route
            path="admin"
            element={<AdminRoute />}
            handle={{ crumb: AdminCrum }}
          >
            <Route index element={<AdminIndexRoute profile={profile} />} />
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
