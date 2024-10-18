import { PropsWithChildren } from "react";
import { FC } from "react";
import { NavLink, NavLinkProps } from "react-router-dom";

export interface TabNavLinkProps {
  to: string;
  end?: boolean;
}

const tabClassName: NavLinkProps["className"] = ({ isActive, isPending }) =>
  `tab-bordered tab ${isActive ? "tab-active" : ""} ${
    isPending ? "tab-active" : ""
  }`;

const TabNavLink: FC<PropsWithChildren<TabNavLinkProps>> = ({
  to,
  end,
  children,
}) => {
  return (
    <NavLink end={end} to={to} className={tabClassName}>
      {children}
    </NavLink>
  );
};

export default TabNavLink;
