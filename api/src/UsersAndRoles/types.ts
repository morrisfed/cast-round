import { Schema } from "effect";

export const User = Schema.Struct({
  userId: Schema.String,
  userType: Schema.Union(Schema.Literal("mwAccount"), Schema.Literal("link")),
  displayName: Schema.String,
  roles: Schema.Array(
    Schema.Struct({
      name: Schema.String,
      appId: Schema.String,
    })
  ),
});

export type User = typeof User.Type;
