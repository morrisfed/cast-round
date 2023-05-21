import React from "react";

import * as E from "fp-ts/lib/Either";

import { uploadAccountsCsv } from "api/admin";
import { ActionFunctionArgs, useFetcher } from "react-router-dom";
import Spinner from "components/Spinner";
import { CrumbDataFn } from "components/Crumb";

export async function uploadAccountsAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const csvFile = formData.get("csv") as File;

  const uploadTask = uploadAccountsCsv(csvFile);

  return await uploadTask();
}

export const UploadAccountsCrumb: CrumbDataFn = () => {
  return { label: "Upload accounts" };
};

const UploadAccounts: React.FC = () => {
  const fetcher = useFetcher();
  const [uploadAttempted, setUploadAttempted] = React.useState(false);

  const uploadResultsElement = React.useMemo(() => {
    if (fetcher.state === "idle") {
      if (uploadAttempted) {
        // We have finished the account upload attempt.
        const resultEither = fetcher.data as Awaited<
          ReturnType<typeof uploadAccountsAction>
        >;
        if (E.isLeft(resultEither)) {
          const error = resultEither.left;
          if (error === "forbidden") {
            return (
              <div id="error-page">
                <h1>Unauthorised</h1>
                <p>Sorry, you do not have permission to upload accounts.</p>
              </div>
            );
          } else {
            return (
              <div className="alert alert-error">
                <div className="flex-1">
                  <div className="font-semibold">Error uploading accounts</div>
                  <div className="text-sm">{error.message}</div>
                </div>
              </div>
            );
          }
        } else {
          const uploadResponse = resultEither.right;
          return (
            <div className="stats stats-vertical shadow md:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Accounts uploaded</div>
                <div className="stat-value text-primary">
                  {uploadResponse.accountsUploaded}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Accounts created</div>
                <div className="stat-value text-secondary">
                  {uploadResponse.accountsCreated}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Accounts updated</div>
                <div className="stat-value">
                  {uploadResponse.accountsUpdated}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">Error count</div>
                <div className="stat-value">{uploadResponse.errors}</div>
              </div>
            </div>
          );
        }
      } else {
        // We have not yet attempted to upload accounts.
        return null;
      }
    } else {
      return <Spinner />;
    }
  }, [fetcher.state, fetcher.data, uploadAttempted]);

  return (
    <div className="p-2">
      <h1 className="text-lg font-semibold">Upload members</h1>
      <p className="m-2">
        Export all members from MembershipWorks to a CSV file and upload it
        here.
      </p>
      <fetcher.Form
        method="post"
        encType="multipart/form-data"
        onSubmit={() => setUploadAttempted(true)}
      >
        <div className="flex flex-wrap gap-2">
          <div className="form-control w-full max-w-xs">
            <input
              type="file"
              name="csv"
              className="file-input-bordered file-input-accent file-input w-full max-w-xs"
            />
          </div>

          <button type="submit" className="btn-outline btn-accent btn">
            Upload
          </button>
        </div>
      </fetcher.Form>
      <div className="divider" />
      {uploadResultsElement}
    </div>
  );
};

export default UploadAccounts;
