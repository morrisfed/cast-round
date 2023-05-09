import * as O from "fp-ts/lib/Option";

import { useUserProfile } from "./UserProfileContext";
import Welcome from "./Welcome";
import Spinner from "./Spinner";
import AuthenticatedLayout from "./AuthenticatedLayout";

function Layout() {
  const { loading: loadingProfile, userProfile } = useUserProfile();

  if (loadingProfile) {
    return (
      <div>
        <Spinner />
      </div>
    );
  }

  if (O.isNone(userProfile)) {
    return <Welcome />;
  }

  return <AuthenticatedLayout profile={userProfile.value} />;

  // return (
  //   <div className="prose max-w-none lg:prose-xl">
  //     <h2 className="bg-red-200 p-1 text-center text-xl font-bold">
  //       Under development
  //     </h2>
  //     <div className="p-4">
  //       <div className="mb-8">
  //         <Header />
  //       </div>
  //       <p>
  //         Welcome to Cast Round, the Morris Federation&apos;s voting system.
  //       </p>
  //     </div>
  //     <div>
  //       <h1>Upload members</h1>
  //       <form
  //         action="/api/admin/member-upload"
  //         method="post"
  //         encType="multipart/form-data"
  //       >
  //         <div className="form-control w-full max-w-xs">
  //           <label className="label">
  //             <span className="label-text">Pick a file</span>
  //           </label>
  //           <input
  //             type="file"
  //             name="csv"
  //             className="file-input-bordered file-input-accent file-input w-full max-w-xs"
  //           />
  //         </div>

  //         <button type="submit" className="btn-outline btn-accent btn">
  //           Upload
  //         </button>
  //       </form>
  //     </div>
  //     <div>
  //       <h1>Accounts</h1>
  //       {accountsLoaded ? (
  //         O.isSome(accounts) ? (
  //           <AccountList accounts={accounts.value} />
  //         ) : (
  //           <p>No accounts</p>
  //         )
  //       ) : (
  //         <p>Loading...</p>
  //       )}
  //     </div>
  //   </div>
  // );
}

export default Layout;
