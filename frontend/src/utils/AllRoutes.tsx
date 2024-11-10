import RootLayout from "@/components/layout/RootLayout";
import { GET_AUTH_USER } from "@/graphql/query/user.query";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFoundPage";
import SignUpPage from "@/pages/SignUpPage";
import TransactionPage from "@/pages/TransactionPage";
import { useQuery } from "@apollo/client";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import ProfilePage from "@/pages/ProfilePage";
import TransactionsPage from "@/pages/TransactionsPage";
import AddTransaction from "@/pages/AddTransaction";

const AllRoutes = () => {
  const location = useLocation();
  const path = location.pathname + location.search;

  const { data } = useQuery(GET_AUTH_USER);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !data?.authenticatedUser ? (
            <LoginPage />
          ) : (
            <Navigate state={{ from: path }} to={"/dashboard"} />
          )
        }
      />
      <Route
        path="/signup"
        element={
          !data?.authenticatedUser ? (
            <SignUpPage />
          ) : (
            <Navigate state={{ from: path }} to={"/dashboard"} />
          )
        }
      />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<RootLayout />}>
          <Route index path="/dashboard" element={<HomePage />} />
          <Route index path="/add-transaction" element={<AddTransaction />} />
          <Route index path="/transactions" element={<TransactionsPage />} />
          <Route index path="/profile" element={<ProfilePage />} />
          <Route path="/transaction/:id" element={<TransactionPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
