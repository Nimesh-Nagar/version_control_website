import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  // Array of references to Repository documents
  repositories: [
    {
      default: [],
      type: Schema.Types.ObjectId, // Reference to the Repository model
      ref: "Repository",
    },
  ],

  // Array of references to User documents for followers
  followedUsers: [
    {
      default: [],
      type: Schema.Types.ObjectId, // Reference to the User model
      ref: "User",
    },
  ],

  // Array of references to Repository documents for starred repositories
  starRepo: [
    {
      default: [],
      type: Schema.Types.ObjectId, // Reference to the Repository model
      ref: "Repository",
    },
  ],
});

const User = mongoose.model("User", UserSchema);

export { User };
