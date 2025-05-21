import { useQuery } from "@apollo/client";
import { GET_AUTH_USER } from "./graphql/query/user.query";
import { Toaster } from "react-hot-toast";
import AllRoutes from "./utils/AllRoutes";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  const { loading } = useQuery(GET_AUTH_USER);

  if (loading) return null;

  return (
    <>
      {/* <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"> */}
      <AllRoutes />
      <Toaster />
      {/* </ThemeProvider> */}
    </>
  );
}
export default App;
