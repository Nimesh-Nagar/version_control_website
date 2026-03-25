import express from "express";

import {
  createRepos,
  getAllRepos,
  fetchRepoById,
  fetchReposByName,
  fetchReposForCurrewntUser,
  updateRepoById,
  toggleVisibilityById,
  deleteRepoById,
} from "../controllers/repoController.js";

export const repoRouter = express.Router();

repoRouter.post("/repos/create", createRepos);

repoRouter.get("/repos/all", getAllRepos);
repoRouter.get("/repos/:id", fetchRepoById);
repoRouter.get("/repos/:name", fetchReposByName);
repoRouter.get("/repos/:userID", fetchReposForCurrewntUser);

repoRouter.put("/repos/update/:id", updateRepoById);
repoRouter.delete("/repos/delete/:id", deleteRepoById);
repoRouter.patch("/repos/toggle/:id", toggleVisibilityById);
