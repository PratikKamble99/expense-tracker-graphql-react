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
function App() {
  const authUser = true;
  const { loading, error, data } = useQuery(GET_AUTH_USER);

  console.log(loading, error, data);

  return (
    <>
      {data?.authenticatedUser && <Header />}
      <Routes>
        <Route path="/" element={data?.authenticatedUser ? <HomePage />: <Navigate to={'/login'} />} />
        <Route path="/login" element={!data?.authenticatedUser ? <LoginPage />: <Navigate to={'/'} />} />
        <Route path="/signup" element={!data?.authenticatedUser ? <SignUpPage />: <Navigate to={'/'} />} />
        <Route path="/transaction/:id" element={data?.authenticatedUser ? <TransactionPage />: <Navigate to={'/login'} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}
export default App;
