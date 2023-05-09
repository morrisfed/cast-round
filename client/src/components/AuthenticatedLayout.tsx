import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import { UserProfile } from "interfaces/user";
import Accounts, { accountsLoader } from "routes/accounts";
import Root from "routes/root";
import ErrorPage from "./Error";
import { delegatesLoader } from "routes/delegates";

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
          path="accounts"
          element={<Accounts />}
          loader={accountsLoader}
          errorElement={<ErrorPage />}
        />
        <Route
          path="delegates"
          element={<div>Delegates</div>}
          loader={delegatesLoader}
          errorElement={<ErrorPage />}
        />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default AuthenticatedLayout;
