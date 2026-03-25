import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGODB_URL;

// MongoDB client instance // We will use this client to connect to the database in our controller functions
let client;
// Function to connect to MongoDB
async function connectClient() {
  if (!client) {
    client = new MongoClient(url);
    await client.connect();
    // console.log("Connected to DB ");
  }
}

// Signup user
async function signup(req, res) {
  const { username, password, email } = req.body;

  try {
    await connectClient();
    const db = client.db("myGithub");
    const userCollections = await db.collection("users");

    const existingUser = await userCollections.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const sault = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, sault);

    const newUser = {
      username,
      password: hashedPassword,
      email,
      repositories: [],
      followedUsers: [],
      starRepos: [],
    };
    const result = await userCollections.insertOne(newUser);

    const token = jwt.sign(
      { id: result.insertedId },
      process.env.JWT_SECRET_KET,
      { expiresIn: "1h" },
    );

    res.json({ token, userId: result.insertId });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

//  Login user
async function login(req, res) {
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("myGithub");
    const userCollections = await db.collection("users");

    const user = await userCollections.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user._id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get all users
async function getAllUsers(req, res) {
  try {
    await connectClient();
    const db = client.db("myGithub");
    const userCollections = await db.collection("users");

    const users = await userCollections.find({}).toArray();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Get user profile by ID
async function getUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("myGithub");
    const userCollections = await db.collection("users");

    // Fetch the user profile based on the provided ID
    const user = await userCollections.findOne({
      _id: new ObjectId(currentID),

      // Assuming the ID is the username, you can change this to _id if you want to use MongoDB ObjectId as the identifier
      // username: currentID,
    });

    //ObjectId is used to convert the string ID to a MongoDB ObjectId type

    // const user = await userCollections.findOne({ currentID });
    console.log("Fetched User Profile:", user); // Log the fetched user profile to verify it's being retrieved correctly

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    await connectClient();
    const db = client.db("myGithub");
    const userCollections = await db.collection("users");

    let updateFields = { email };
    if (password) {
      const sault = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, sault);
      updateFields.password = hashedPassword;
    }

    const result = await userCollections.findOneAndUpdate(
      { _id: new ObjectId(currentID) },
      { $set: updateFields },
    );

    if (!result) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function deleteUserProfile(req, res) {
  const currentID = req.params.id;

  try {
    await connectClient();
    const db = client.db("myGithub");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(currentID),
    });

    if (result.deleteCount == 0) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.json({ message: "User Profile Deleted!" });
  } catch (err) {
    console.error("Error during updating : ", err.message);
    res.status(500).send("Server error!");
  }
}

export {
  getAllUsers,
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
