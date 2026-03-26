import mongoose, { Schema } from "mongoose";

const RepositorySchema = new Schema(
  {
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
      type: Array,
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
  },
  { timestamps: true },
);

const Repository = mongoose.model("Repository", RepositorySchema);

export { Repository };
