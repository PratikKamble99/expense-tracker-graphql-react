import React, { useEffect } from "react";
import { Sidebar, SidebarProvider } from "../ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "../custom/AppSidebar";
import { SIDEBAR_WIDTH } from "@/constants";
import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import useNavigation from "@/hooks/useNavigate";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigation();

  const { data } = useQuery(GET_AUTH_USER);

  useEffect(()=>{
    if(data?.authenticatedUser && location?.pathname ==  '/'){
      navigate(location?.state?.from || '/dashboard')
    }
  },[])
  return (
    <div className="flex">
      <aside className={` w-[${SIDEBAR_WIDTH}]`}>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </aside>
      <div className={`w-[calc(100%_-_${SIDEBAR_WIDTH})] flex-grow`}>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
