import React, { useCallback, useEffect, useState } from "react";

import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";

import Spinner from "components/Spinner";
import { AccountUserInfo } from "api/accounts";
import {
  getFilteredVoters,
  getVoters,
  refreshVoters,
} from "events/motion-voters-service";
import AccountList from "components/Account/AccountList";
import FilterInput from "components/FilterInput";

const MotionVotersViewController: React.FC = () => {
  const [filterString, setFilterString] = React.useState("");
  const [voters, setVoters] = useState<readonly AccountUserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const applyFilter = useCallback(async (fstr: string) => {
    setLoading(true);
    setError(false);

    let taskEither: TE.TaskEither<
      "forbidden" | Error,
      readonly AccountUserInfo[]
    >;

    if (fstr.length === 0) {
      taskEither = getVoters();
    } else {
      taskEither = getFilteredVoters(fstr);
    }

    const retrievedVotersEither = await taskEither();

    if (E.isLeft(retrievedVotersEither)) {
      setError(true);
    } else {
      setVoters(retrievedVotersEither.right);
    }

    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    setError(false);
    setFilterString("");
    refreshVoters();

    applyFilter("");
  }, [applyFilter]);

  useEffect(() => {
    applyFilter(filterString);
  }, [applyFilter, filterString]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div>
        <p>An error has occured while loading voters.</p>
        <p>Please tap refresh to try again.</p>
        <button className="btn-primary btn" onClick={() => onRefresh()}>
          Refresh
        </button>
      </div>
    );
  }

  return (
    <>
      <FilterInput
        filterString={filterString}
        setFilterString={setFilterString}
      />
      <AccountList accounts={voters} linkPathPrefix="" />
    </>
  );
};

export default MotionVotersViewController;
