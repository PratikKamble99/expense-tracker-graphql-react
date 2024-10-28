import {
  Calendar,
  Home,
  Inbox,
  LogOut,
  Phone,
  Search,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useLocation } from "react-router-dom";
import { LOG_OUT } from "@/graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import RouterLink from "../modified/RouterLink";

// Menu items.
const items = [
  {
    title: "Home",
    url: "dashboard",
    icon: Home,
  },
  {
    title: "Transactions",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Profile",
    url: "profile",
    icon: User,
  },
  {
    title: "Support",
    url: "#",
    icon: Phone,
  },
];

export default function AppSidebar() {
  const location = useLocation();

  const { data } = useQuery(GET_AUTH_USER);
  const [logoutUser, { loading, client }] = useMutation(LOG_OUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });

  const handleLogout = async () => {
    try {
      await logoutUser();
      client.resetStore();
    } catch (error) {
      toast.error(error?.message);
    }
  };

  return (
    <Sidebar className="bg-[#1b1b1b]">
      <SidebarContent className="items-center">
        <div className="flex flex-col items-center justify-center pt-8 pb-6">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={data?.authenticatedUser?.profilePicture}
              alt="profile-picture"
              className=""
            />
            <AvatarFallback>
              {data?.authenticatedUser?.name.charAt(0) +
                data?.authenticatedUser?.name.charAt(1)}
            </AvatarFallback>
          </Avatar>
          <p className="text-xl font-bold text-[#868686]">
            {data?.authenticatedUser?.name}
          </p>{" "}
        </div>
        <SidebarGroup className="w-[90%]">
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-2">
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={`bg-[#28282a] py-2 rounded-md ${
                    location.pathname.includes(item.url)
                      ? "text-[#04c8b7] font-bold"
                      : "text-inherit"
                  } px-2`}
                >
                  <SidebarMenuButton asChild>
                    <RouterLink to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </RouterLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup className="w-[90%]">
          <SidebarGroupContent>
            <SidebarMenu className="gap-y-2">
              <SidebarMenuItem className="bg-[#28282a] py-2 rounded-md px-2">
                <SidebarMenuButton asChild>
                  <SidebarMenuButton asChild>
                    <div className="flex cursor-pointer" onClick={handleLogout}>
                      <LogOut />
                      <span>logout</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
