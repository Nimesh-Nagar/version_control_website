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
    console.error(" Error during repository creation -----> ", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function getAllRepos(req, res) {
  try{
    const repository = await Repository.find({})
    .populate("owner")
    .populate("issues");

    res.json(repository)

  }
  catch (error) {
    console.error(" Error during fetching repository -----> ", error);
    res.status(500).json({ message: "Server Error" });
  }

}

export async function fetchRepoById(req, res) {
  const { id } = req.params; 
  try{

    const repository = await Repository.find({ _id : id}).populate("owner").populate("issues");

    res.json(repository)

  }catch(error){
    console.error(" Error during fetching repository by id-----> ", error);
    res.status(500).json({ message: "Server Error" });
  }
}

export async function fetchReposByName(req, res) {
   const { name } = req.params;
  try {
    
    const repository = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.json(repository);
  } catch (err) {
    console.error("Error during fetching repository : ", err.message);
    res.status(500).send("Server error");
  }
}

export async function fetchReposForCurrewntUser(req, res) {
    console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

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

export async function toggleVisibilityById(req, res) {
  console.log("Repository visibility toggled");
}

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
