import React, { useEffect, useState } from "react";
import { SidebarMenuItem, SidebarProvider } from "../ui/sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import AppSidebar, { items } from "../custom/AppSidebar";
import { SIDEBAR_WIDTH } from "@/constants";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import useNavigation from "@/hooks/useNavigate";
import { X } from "lucide-react";
import { LOG_OUT } from "@/graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import { Dialog, DialogContent } from "../ui/dialog";
import VerifyEmail from "../VerifyEmailCard";

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigation();

  const { data } = useQuery(GET_AUTH_USER);

  const [logoutUser, { client }] = useMutation(LOG_OUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const [openMobNav, setOpenMobNav] = useState(false);

  useEffect(() => {
    if (data?.authenticatedUser && location?.pathname == "/") {
      navigate(location?.state?.from || "/dashboard");
    }
  }, []);

  const handleLogout = async () => {
    try {
      const promise = new Promise((res, rej) => {
        const response = logoutUser();
        client.resetStore();
        res(response);
      });
      toast.promise(promise, {
        loading: "Logging out...",
        success: "Logged out successfully",
        error: "Failed to log out",
      });
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <div className="lg:flex h-full">
      <nav className="lg:hidden w-full relative">
        <div className="flex flex-wrap items-center justify-between p-4">
          <h1 className="md:text-6xl text-4xl lg:text-8xl font-bold text-center  relative z-50 text-white">
            Expense <Link to="/">GQL</Link>
          </h1>
          <button
            data-collapse-toggle="navbar-default"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg lg:hidden hover:bg-[#28282A] focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded="false"
            onClick={() => setOpenMobNav(true)}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          {openMobNav ? (
            <div
              className="fixed top-0 right-0 left-0 z-[999] bg-[#232323] p-3 transition-all "
              id="navbar-default"
            >
              <div className="relative flex">
                <div className="flex gap-2 p-1 flex-grow">
                  <h1 className="md:text-6xl text-4xl lg:text-8xl font-bold text-center  relative z-50 text-white">
                    Expense <Link to="/">GQL</Link>
                  </h1>
                </div>
                <X
                  className="absolute right-0 top-3 cursor-pointer"
                  onClick={() => setOpenMobNav(false)}
                />
              </div>
              <ul className="font-medium flex flex-col gap-y-2 p-4 md:p-0 mt-4 rounded-lg  lg:flex-row lg:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 lg:bg-white dark:bg-gray-800 lg:dark:bg-gray-900 dark:border-gray-700">
                {items.map((item) => (
                  <SidebarMenuItem
                    key={item.url}
                    className={`bg-[#28282a] py-2 rounded-md ${
                      location.pathname.includes(item.url.split("?")[0])
                        ? "text-text-primary font-bold"
                        : "text-inherit"
                    } px-2 cursor-pointer`}
                  >
                    <Link
                      to={item.url}
                      aria-current="page"
                      onClick={() => setOpenMobNav(false)}
                    >
                      {item.title}
                    </Link>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem
                  className={`bg-[#28282a] py-2 rounded-md px-2 cursor-pointer`}
                >
                  <div className="flex cursor-pointer" onClick={handleLogout}>
                    {/* <LogOut /> */}
                    <span>logout</span>
                  </div>
                </SidebarMenuItem>
              </ul>
            </div>
          ) : null}
        </div>
      </nav>
      <aside className={`w-[${SIDEBAR_WIDTH}] hidden lg:block`}>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </aside>
      <div className={`w-[calc(100%_-_${SIDEBAR_WIDTH})] flex-grow relative`}>
        <Dialog open={data?.authenticatedUser?.isEmailValid == false}>
          <DialogContent closeColor={"white"}>
            <VerifyEmail
              handleLogout={handleLogout}
              email={data.authenticatedUser.email}
            />
          </DialogContent>
        </Dialog>
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
