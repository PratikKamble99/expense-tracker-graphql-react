import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import ConnectMongoDBSession from "connect-mongodb-session";
import { buildContext } from "graphql-passport";
import path from "path";

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";
import { emailCron } from "./cronjob/email-cron.js";

// Load environment variables
dotenv.config();
configurePassport();

const __dirname = path.resolve();
const app = express();
const httpServer = http.createServer(app);

// MongoDB session store setup
const MongoDBStore = ConnectMongoDBSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("error", (err) => console.error("Session Store Error:", err));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      httpOnly: true,
    },
    store,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

async function init() {
  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  // Apply Apollo middleware
  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  // const { url } = await startStandaloneServer(server, {
  //   listen: { port: 4001 },
  // });

  app.use(
    "/graphql",
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => buildContext({ req, res }),
    })
  );

  // Serve frontend
  const frontendPath = path.join(__dirname, "frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  // Connect to DB and start server
  await connectDB();
  emailCron();

  httpServer.listen({ port: 4001 }, () => {
    console.log(`🚀 Server ready at http://localhost:4001/graphql`);
  });
}

init().catch((err) => {
  console.error("Failed to start server:", err);
});
