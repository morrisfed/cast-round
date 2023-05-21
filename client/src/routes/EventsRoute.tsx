import { CrumbDataFn } from "components/Crumb";
import React from "react";

import { Outlet } from "react-router-dom";

export const EventsCrumb: CrumbDataFn = () => {
  return { label: "Events" };
};

const EventsRoute: React.FC = () => {
  return <Outlet />;
};

export default EventsRoute;
