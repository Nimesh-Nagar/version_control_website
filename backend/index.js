import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Server } from "socket.io"; // for real-time communication
import { mainRouter } from "./routes/main.router.js";

dotenv.config();

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { initRepo } from "./controllers/init.js";
import { addFile } from "./controllers/add.js";
import { commitChanges } from "./controllers/commit.js";
import { pushRepo } from "./controllers/push.js";
import { pullRepo } from "./controllers/pull.js";
import { revertCommit } from "./controllers/revert.js";

// command line interface using yargs
// explanation:
// "init" is the command name, "Initialise new repository" is the description of the command, {} is the builder function which can be used to define options for the command, initRepo is the handler function which will be executed when the command is called.

yargs(hideBin(process.argv))
  .command("start", "Starts new server", startServer)
  .command("init", "Initialise new repository", {}, initRepo)

  .command(
    "add <file>",
    "Add a file to repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File add to stagging area",
        type: "string",
      });
    },
    (argv) => {
      addFile(argv.file);
    },
  )

  .command(
    "commit <message>",
    "Add a commit message",
    (yargs) => {
      yargs.positional("message", {
        describe: "commit message",
        type: "string",
      });
    },
    (argv) => {
      commitChanges(argv.message);
    },
  )
  .command("push", "push commit to s3", {}, pushRepo)
  .command("pull", "pull commit from s3", {}, pullRepo)

  .command(
    "revert <commitID>",
    "revert last commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "commit ID to revert",
        type: "string",
      });
    },

    (argv) => {
      revertCommit(argv.commitID);
    },
  )

  .demandCommand(1, "You need at least one command")
  .help().argv;

function startServer() {
  const app = express();
  const port = process.env.PORT || 9000;

  app.use(bodyParser.json());
  app.use(express.json());

  const db_url = process.env.MONGODB_URL;

  mongoose
    .connect(db_url)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB : ", err);
    });

  app.use(cors({ origin: "*" }));

  app.use("/", mainRouter);

  let user = "test";
  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinRoom", (userID) => {
      user = userID;
      console.log("=======");
      console.log(user);
      console.log("=======");
      console.log(userID);
    });
  });

  const db = mongoose.connection;

  /*
    * Once the connection to the database is open, we can perform CRUD operations.  

  */
  // [db.once] explation: The once() method is used to listen for a single occurrence of the "open" event on the database connection. When the connection is successfully opened, the callback function is executed, allowing us to perform any necessary operations that require an active database connection. In this case, we are logging a message to indicate that CRUD operations can now be performed.
  db.once("open", async () => {
    console.log("CRUD operations called");
    // CRUD operations
  });

  // Start the server
  httpServer.listen(port, () => {
    console.log(`Server is running on PORT ${port}`);
  });
}
