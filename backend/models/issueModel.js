import mongoose from "mongoose";
import { Schema } from "mongoose";

const IssueSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["open", "close"],
      default: "open",
    },
    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },
  },
  { timestamps: true },
);

const Issue = mongoose.model("Issue", IssueSchema);
export { Issue };
