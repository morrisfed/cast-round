import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { UserProfile } from "interfaces/user";
import ErrorPage from "./Error";
import Root from "routes/Root";
import Account, { accountLoader } from "routes/Account";
import Accounts, { accountsLoader } from "routes/Accounts";
import Delegates, { delegatesLoader } from "routes/Delegates";
import Admin from "routes/Admin";
import UploadAccounts, { uploadAccountsAction } from "routes/UploadAccounts";
import AdminIndex from "routes/AdminIndex";
import NewAccountDelegate, {
  createAccountDelegateAction,
} from "routes/NewAccountDelegate";
import AccountDelegates, {
  accountDelegatesLoader,
} from "routes/AccountDelegates";
import Events, { eventsLoader } from "routes/Events";
import NewEvent, { createEventAction } from "routes/NewEvent";
import Event, { eventLoader } from "routes/Event";

export interface AuthenticatedLayoutProps {
  profile: UserProfile;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  profile,
}) => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Root profile={profile} />}>
        <Route
          path="accounts/:accountId"
          element={<Account />}
          loader={accountLoader}
          errorElement={<ErrorPage />}
        >
          <Route
            index
            element={<AccountDelegates />}
            loader={accountDelegatesLoader}
          />
          <Route
            path="newdelegate"
            element={<NewAccountDelegate />}
            action={createAccountDelegateAction}
          />
        </Route>
        <Route
          path="accounts"
          element={<Accounts />}
          loader={accountsLoader}
          errorElement={<ErrorPage />}
        ></Route>
        <Route
          path="delegates"
          element={<Delegates />}
          loader={delegatesLoader}
          errorElement={<ErrorPage />}
        />
        <Route
          path="events"
          element={<Events />}
          loader={eventsLoader}
          errorElement={<ErrorPage />}
        ></Route>
        <Route
          path="events/newevent"
          element={<NewEvent />}
          action={createEventAction}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/events/:eventId"
          element={<Event />}
          loader={eventLoader}
          errorElement={<ErrorPage />}
        />

        <Route path="admin" element={<Admin />}>
          <Route index element={<AdminIndex />} />
          <Route
            path="uploadAccounts"
            element={<UploadAccounts />}
            action={uploadAccountsAction}
          />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default AuthenticatedLayout;
