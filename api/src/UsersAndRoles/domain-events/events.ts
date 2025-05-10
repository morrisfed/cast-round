import { Data } from "effect";
import { publishDomainEvent } from "../../services/domain-events/publisher";

export interface RolesRegisteredDomainEvent {
  _tag: "RolesRegisteredDomainEvent";
  appId: string;
  roleNames: string[];
}

export const RolesRegisteredDomainEvent =
  Data.tagged<RolesRegisteredDomainEvent>("RolesRegisteredDomainEvent");

export const publishRolesRegisteredDomainEvent = (
  rolesRegisteredDomainEvent: RolesRegisteredDomainEvent
) => publishDomainEvent(rolesRegisteredDomainEvent);
