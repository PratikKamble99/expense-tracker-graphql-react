import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import App from "./App.tsx";
import "./index.css";
import GridBackground from "./components/ui/GridBackground.tsx";

const client = new ApolloClient({
  uri: import.meta.env.VITE_NODE_ENV == "development" ?  "http://localhost:4001/graphql" : "/graphql",
  cache: new InMemoryCache(),
  credentials: "include", // This tells Apollo Client to send cookies along with every request to the server.
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <GridBackground>
        <ApolloProvider client={client}>
          <App />
        </ApolloProvider>
      </GridBackground>
    </BrowserRouter>
  </StrictMode>
);
