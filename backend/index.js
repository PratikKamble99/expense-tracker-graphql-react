import { ApolloServer } from "@apollo/server"; // preserve-line
import { startStandaloneServer } from "@apollo/server/standalone"; // preserve-line

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

import mergedResolvers from "./resolvers/index.js";
import mergedTypeDefs from "./typeDefs/index.js";
import { connectDB } from "./db/connectDb.js";
import { configurePassport } from "./passport/passport.config.js";

dotenv.config();

configurePassport();

const app = express();
const httpServer = http.createServer(app);

const MongoDBStore = ConnectMongoDBSession(session);

const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

store.on("Error", (err) =>  console.log(err));

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave: false, // this option specifies whether to save the session to the store on every request
  saveUninitialized: false, // option specifies whether to save uninitialized sessions
  cookie:{
    maxAge:1000*60*60*24*7,
    httpOnly: true // this option prevents the Cross-Site Scripting (XSS) attacks
  },
  store:store
}));

app.use(passport.initialize());
app.use(passport.session())

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();

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
    origin:'http://localhost:5431',
    credentials:true
  }),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req, res }) => buildContext({req, res}),
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4001 }, resolve));
await connectDB();
console.log(`🚀 Server ready at http://localhost:4001/graphql`);
