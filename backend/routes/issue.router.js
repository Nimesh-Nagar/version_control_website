import express from "express";

import {
  createIssue,
  getAllIssues,
  fetchIssueById,
  deleteIssueById,
  updateIssueById,
} from "../controllers/issueController.js";

export const issueRouter = express.Router();

issueRouter.post("/issues/create", createIssue);

issueRouter.get("/issues/all", getAllIssues);
issueRouter.get("/issues/:id", fetchIssueById);

issueRouter.delete("/issues/delete/:id", deleteIssueById);
issueRouter.put("/issues/update/:id", updateIssueById);
