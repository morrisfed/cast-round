import { Schema } from "effect";

const RoleDefinition = Schema.Struct({
  name: Schema.String,
  appId: Schema.String,
});

const RolesCollection = Schema.Array(RoleDefinition);

export const User = Schema.Struct({
  userId: Schema.String,
  userType: Schema.Union(Schema.Literal("mwAccount"), Schema.Literal("link")),
  displayName: Schema.String,
  roles: RolesCollection,
});

export type RoleDefinition = typeof RoleDefinition.Type;
export type RolesCollection = typeof RolesCollection.Type;
export type User = typeof User.Type;
