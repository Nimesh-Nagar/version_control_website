import mongoose from "mongoose";
import { Repository } from "../models/repoModel.js";
import { Issue } from "../models/issueModel.js";
import { User } from "../models/userModel.js";

// Create a new issue for a repository
export async function createIssue(req, res) {
  try {
    const { title, description, repository } = req.body;
    if (!title || !description || !repository) {
      return res
        .status(400)
        .json({ error: "Title, description, and repository are required." });
    }

    // Ensure repository is a valid ObjectId
    let repoId;
    try {
      repoId = new mongoose.Types.ObjectId(repository);
    } catch (e) {
      return res.status(400).json({ error: "Invalid repository ID format." });
    }

    const issue = new Issue({
      title,
      description,
      repository: repoId,
    });

    await issue.save();
    res.status(201).json(issue);
  } catch (err) {
    console.error("Error during issue creation : ", err);
    res
      .status(400)
      .json({ error: "Error during issue creation : " + err.message });
  }
}

export async function getAllIssues(req, res) {
  const { id } = req.params;

  try {
    const issues = await Issue.find({ repository: id });

    if (!issues) {
      return res.status(404).json({ error: "Issues not found!" });
    }
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error during issue fetching : ", err.message);
    res.status(500).send("Server error");
  }
}

export async function fetchIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}

export async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }
    res.json({ message: "Issue deleted" });
  } catch (err) {
    console.error("Error during issue deletion : ", err.message);
    res.status(500).send("Server error");
  }
}

export async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({ error: "Issue not found!" });
    }

    issue.title = title;
    issue.description = description;
    issue.status = status;

    await issue.save();

    res.json(issue, { message: "Issue updated" });
  } catch (err) {
    console.error("Error during issue updation : ", err.message);
    res.status(500).send("Server error");
  }
}
