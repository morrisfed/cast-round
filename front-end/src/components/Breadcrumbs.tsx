import React from "react";
import { Link, useMatches } from "react-router-dom";
import { CrumbData, CrumbMatch } from "./Crumb";

const homeLink = (
  <Link to="/" className="p-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="inline-block h-6 w-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  </Link>
);

const Breadcrumb: React.FC<CrumbData & { path: string }> = ({
  label,
  path,
}) => {
  return (
    <span>
      <span className="align-middle"> - </span>
      <Link className="p-2 align-middle" to={path}>
        {label}
      </Link>
    </span>
  );
};

const Breadcrumbs: React.FC = () => {
  const matches = useMatches() as Array<CrumbMatch>;

  const crumbs = matches
    .filter((match) => !!match.handle?.crumb)
    .map((match) => {
      const crumbData = match.handle!.crumb(match);
      return (
        <Breadcrumb
          key={match.pathname}
          path={match.pathname}
          label={crumbData.label}
        />
      );
    });
  return (
    <div className="bg-black/10 p-4">
      {homeLink}
      {crumbs}
    </div>
  );
};

export default Breadcrumbs;
