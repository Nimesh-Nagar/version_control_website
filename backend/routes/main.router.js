import express from "express";
import { userRouter } from "./user.router.js";
import { repoRouter } from "./repo.router.js";
import { issueRouter } from "./issue.router.js";

const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
  res.send("<h1>Welcome to the main route</h1>");
});

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);

export { mainRouter };
