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
    // new repository instance
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
    console.error(" Error during repository creation -----> ", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getAllRepos(req, res) {
  try {
    /* 
    Fetch all repositories and populate the owner and issues fields.
    Why we need to populate owner and issues here ?
      - owner field is populated to get the details of the user who owns the repository, such as their username and email.
      - issues field is populated to get the details of the issues associated with the repository, such as their title, description, and status.
    */
    const repository = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (error) {
    console.error(" Error during fetching repository -----> ", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Get repository by ID
export async function fetchRepoById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.find({ _id: id })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (error) {
    console.error(" Error during fetching repository by id-----> ", error);
    res.status(500).json({ message: "Server Error" });
  }
}

// Get repository by name
export async function fetchReposByName(req, res) {
  const { name } = req.params;
  try {
    // Fetch the repository by name and populate the owner and issues fields
    const repository = await Repository.find({ name })
      .populate("owner") //
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

// Get repositories for a specific user
export async function fetchReposForCurrewntUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });

    // Check if repositories are found for the user
    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    // Error handling for fetching repositories for the current user
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

// Update repository by ID
export async function updateRepoById(req, res) {
  const { id } = req.params;
  const { content, description } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.content.push(content);
    repository.description = description;

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error("Error during updating repository : ", err.message);
    res.status(500).send("Server error");
  }
}

// Toggle repository visibility by ID
export async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    repository.visibility =
      repository.visibility === "public" ? "private" : "public";

    const updatedRepository = await repository.save();

    res.json({
      message: "Repository visibility toggled successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error(
      "Error during toggling repository visibility : ",
      err.message,
    );
    res.status(500).send("Server error");
  }
}

// Delete repository by ID
export async function deleteRepoById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ error: "Repository not found!" });
    }

    res.json({ message: "Repository deleted successfully!" });
  } catch (err) {
    console.error("Error during deleting repository : ", err.message);
    res.status(500).send("Server error");
  }
}
