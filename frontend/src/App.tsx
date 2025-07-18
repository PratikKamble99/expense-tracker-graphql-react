import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "./graphql/query/user.query";
import { Toaster } from "react-hot-toast";
import AllRoutes from "./utils/AllRoutes";
import { HelmetProvider } from "react-helmet-async";

function App() {
  const { loading } = useQuery(GET_AUTH_USER);

  if (loading) return null;

  return (
    <HelmetProvider>
      <AllRoutes />
      <Toaster />
    </HelmetProvider>
  );
}

export default App;
