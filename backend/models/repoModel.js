import mongoose from "mongoose";
import { Schema } from "mongoose";
import { describe } from "yargs";

const RepositorySchema = new Schema({
  timestamp: true,
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  },

  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public",
  },

  owner: {
    type: Schema.Types.ObjectId, // Reference to the User model
    ref: "User",
    required: true,
  },

  issues: [
    {
      type: Schema.Types.ObjectId, // Reference to the Issue model
      ref: "Issue",
    },
  ],
});

const Repository = mongoose.model("Repository", RepositorySchema);

export { Repository };
