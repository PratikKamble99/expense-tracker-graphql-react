import React from "react";
import { Helmet } from "react-helmet-async";

type Props = {
  title?: string;
  subTitle?: string;
  children?: React.ReactNode;
};

const HelmetComponent = ({
  children,
  title = "Expense tracker",
  subTitle,
}: Props) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{subTitle ? `${title} - ${subTitle}` : title}</title>
      {children}
    </Helmet>
  );
};

export default HelmetComponent;
