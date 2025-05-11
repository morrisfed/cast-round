import axios from "axios";
import { Effect, Schema } from "effect";

const DekWithLabel = Schema.Struct({
  deck_id: Schema.String,
  label: Schema.String,
});

const MembershipWorksUserInfoResponse = Schema.Struct({
  accountId: Schema.propertySignature(Schema.String).pipe(
    Schema.fromKey("account_id")
  ),
  accountName: Schema.propertySignature(Schema.String).pipe(
    Schema.fromKey("name")
  ),
  contactName: Schema.propertySignature(Schema.String).pipe(
    Schema.fromKey("contact_name")
  ),
  membership: Schema.NonEmptyArray(DekWithLabel),
  label: Schema.optional(Schema.Array(DekWithLabel)),
});

const MembershipWorksUserInfo = Schema.Struct({
  accountId: Schema.String,
  accountName: Schema.String,
  contactName: Schema.String,
  membershipAndLabels: Schema.Array(Schema.String),
});

type MembershipWorksUserInfoResponse =
  typeof MembershipWorksUserInfoResponse.Type;
type MembershipWorksUserInfo = typeof MembershipWorksUserInfo.Type;

const retrieveMwUserInfo = (accessToken: string) =>
  Effect.tryPromise({
    try: () =>
      axios.get<MembershipWorksUserInfoResponse>(
        "https://api.membershipworks.com/v2/oauth2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      ),
    catch: (unknown) =>
      new Error(`Error in HTTP get to MW API`, {
        cause: unknown,
      }),
  }).pipe(Effect.andThen((response) => response.data));

const mwUserResponseToMwUser = (
  mwUserInfo: MembershipWorksUserInfoResponse
): MembershipWorksUserInfo => ({
  accountId: mwUserInfo.accountId,
  accountName: mwUserInfo.accountName,
  contactName: mwUserInfo.contactName,
  membershipAndLabels: [
    ...mwUserInfo.membership.map((x) => x.label),
    ...(mwUserInfo.label?.map((x) => x.label) ?? []),
  ],
});

export const getMwUserProfileForToken = (accessToken: string) =>
  retrieveMwUserInfo(accessToken).pipe(
    Effect.andThen(Schema.decodeUnknownSync(MembershipWorksUserInfoResponse)),
    Effect.andThen((foo) => mwUserResponseToMwUser(foo))
  );
