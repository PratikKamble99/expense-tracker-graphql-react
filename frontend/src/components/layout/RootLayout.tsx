import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useMutation, useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import useNavigation from "@/hooks/useNavigate";
import { Home, Plus, List, User, LogOut, Wallet, Settings } from "lucide-react";
import { LOG_OUT } from "@/graphql/mutations/user.mutation";
import toast from "react-hot-toast";
import { useClickAway } from "@uidotdev/usehooks";

interface MobileTab {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const RootLayout = () => {
  const location = useLocation();
  const navigate = useNavigation();

  const { data } = useQuery(GET_AUTH_USER);
  const [logoutUser, { client }] = useMutation(LOG_OUT, {
    refetchQueries: ["GetAuthenticatedUser"],
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useClickAway(() => {
    setIsProfileOpen(false);
  });

  const mobileTabs: MobileTab[] = [
    { title: 'Home', icon: Home, path: '/dashboard' },
    { title: 'Add', icon: Plus, path: '/add-transaction' },
    { title: 'Transactions', icon: List, path: '/transactions' },
    { title: 'Profile', icon: User, path: '/profile' },
  ];

  useEffect(() => {
    if (data?.authenticatedUser && location?.pathname === "/") {
      navigate("/dashboard");
    }
  }, [data, location, navigate]);

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
    <div className="min-h-screen bg-[#F5FAF7] flex flex-col lg:flex-row" style={{ background: 'linear-gradient(to bottom, #E6F1EC, #F5FAF7)' }}>
      {/* Mobile Header */}
      <header className="lg:hidden w-full bg-[#0D3F32] shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold text-white">Expense Tracker</h1>
          </div>
          <div 
            ref={profileRef}
            className="relative"
          >
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <User className="w-4 h-4 text-white" />
            </button>
            
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100">
                {/* <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link> */}
                {/* <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link> */}
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:top-0 lg:left-0 lg:bottom-0 lg:w-64 lg:flex-col bg-[#0D3F32] text-white overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <Wallet className="w-5 h-5 text-[#0D3F32]" />
            </div>
            <h2 className="text-lg font-semibold text-white">Expense Tracker</h2>
          </div>
          <nav className="space-y-1">
            {mobileTabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/80 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/60'}`} />
                  <span>{tab.title}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-white/5 mt-4"
            >
              <LogOut className="w-5 h-5 text-white/60" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 lg:pl-64 w-full lg:pt-0">
        <div className="px-4 py-6 lg:py-8 h-full overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm text-[#000000]">
            <Outlet />
          </div>
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0D3F32] border-t border-white/10 lg:hidden z-50 shadow-lg">
        <div className="flex justify-around items-center h-16 px-2 safe-area-inset-bottom">
          {mobileTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className={`flex flex-col items-center justify-center w-full h-full ${
                  isActive ? 'text-white' : 'text-white/60'
                } transition-colors`}
              >
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/10' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs mt-0.5">{tab.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default RootLayout;
