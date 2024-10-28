import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/ui/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TransactionPage from "./pages/TransactionPage";
import NotFound from "./pages/NotFoundPage";
import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "./graphql/query/user.query";
import { Toaster } from "react-hot-toast";
import SignUpPage from "./pages/SignUpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

import { ThemeProvider } from "@/components/ThemProvider";
import AllRoutes from "./utils/AllRoutes";

function App() {
  const { loading, error, data } = useQuery(GET_AUTH_USER);

  if (loading) return null;

  return (
    <>
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
        {/* {data?.authenticatedUser && <Header />} */}
        <AllRoutes/>
      {/* </ThemeProvider> */}
      <Toaster />
    </>
  );
}
export default App;
