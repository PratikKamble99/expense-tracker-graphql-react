import React from "react";
import { Link, useLocation } from "react-router-dom";

type Props = {
  to: string;
  children: React.ReactNode;
};

const RouterLink = ({ to, children }: Props) => {
  const location = useLocation();
  const path = location.pathname + location.search;

  return (
    <Link to={to} state={{ from: path }}>
      <div className="flex items-center gap-2">{children}</div>
    </Link>
  );
};

export default RouterLink;
