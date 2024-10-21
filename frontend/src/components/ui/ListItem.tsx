import React from "react";

const ListItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <li
      className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer"
      onClick={onClick && onClick}
    >
      {children}
    </li>
  );
};

export default ListItem;
