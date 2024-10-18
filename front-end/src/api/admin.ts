import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";

import axios, { AxiosError } from "axios";

export interface UpdateAccountsCsvResponse {
  success: boolean;
  accountsUploaded: number;
  accountsCreated: number;
  accountsUpdated: number;
  errors: number;
  errorMessages: string[];
}

export const uploadAccountsCsv = (file: File) => {
  const formData = new FormData();
  formData.set("csv", file);

  return pipe(
    TE.tryCatch(
      () =>
        axios.post<UpdateAccountsCsvResponse>(
          "/api/admin/member-upload",
          formData
        ),
      (reason) => {
        const error = reason as AxiosError;
        if (error.response) {
          if (error.response.status === 403) {
            return "forbidden";
          }
        }
        return new Error(`${reason}`);
      }
    ),
    TE.map((response) => response.data)
  );
};
