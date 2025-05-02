import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "./graphql/query/user.query";
import { Toaster } from "react-hot-toast";
import AllRoutes from "./utils/AllRoutes";

function App() {
  const { loading } = useQuery(GET_AUTH_USER);

  if (loading) return null;

  return (
    <>
      <AllRoutes />
      <Toaster />
    </>
  );
}
export default App;
