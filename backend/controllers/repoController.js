import mongoose from "mongoose";
import { Repository } from "../models/repoModel.js";
import { Issue } from "../models/issueModel.js";
import { User } from "../models/userModel.js";

export async function createRepos(req, res) {
  const { owner, name, description, content, visibility } = req.body;

  try {
    if (!name) {
      return res.status(400).json({ message: "Repository name is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({ message: "Invalid owner ID" });
    }
    const newRepo = new Repository({
      owner,
      name,
      description,
      issues: [],
      content,
      visibility,
    });

    const savedRepo = await newRepo.save();

    res.status(201).json({
      message: "Repository created successfully",
      repositoryId: savedRepo._id,
      repository: savedRepo,
    });
  } catch (error) {
    console.error("[ Error during repository creation ] : ", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getAllRepos(req, res) {
  console.log("All Repositories");
}

export async function fetchRepoById(req, res) {
  console.log("Repository with ID");
}

export async function fetchReposByName(req, res) {
  console.log("Repository with Name");
}

export async function fetchReposForCurrewntUser(req, res) {
  console.log("Repositories for current user");
}

export async function updateRepoById(req, res) {
  console.log("Repository updated");
}

export async function toggleVisibilityById(req, res) {
  console.log("Repository visibility toggled");
}

export async function deleteRepoById(req, res) {
  console.log("Repository deleted");
}
