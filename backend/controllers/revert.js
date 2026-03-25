import fs from "fs";
import path from "path";
import { promisify } from "util"; // Added import for promisify

//
const readdir = promisify(fs.readdir); // Added promisified version of readdir
const copyFile = promisify(fs.copyFile); // Added promisified version of copyFile

/*
Explaination: 
1. We import the necessary modules: `fs` for file system operations, `path` for handling file paths, and `promisify` from the `util` module to convert callback-based functions to promise-based ones.

2. We create promisified versions of `fs.readdir` and `fs.copyFile` using `promisify`. This allows us to use async/await syntax for these operations, making the code cleaner and easier to read.

3. The `revertCommit` function is defined as an asynchronous function. Currently, it only logs a message indicating that a revert operation from S3 is being performed. The actual implementation of reverting a commit from S3 would involve more complex logic, such as identifying the commit to revert, fetching the relevant files from S3, and replacing the current files in the local repository with those from the specified commit.

4. Finally, we export the `revertCommit` function so that it can be used in other parts of the application.

*/

async function revertCommit(commitID) {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const commitsPaths = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPaths, commitID);
    const files = await readdir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    for (const file of files) {
      await copyFile(path.join(commitDir, file), path.join(parentDir, file));
    }

    console.log(`Commit ${commitID} reverted successfully!`);
  } catch (error) {
    console.log("Error in reverting commit from S3 : ", error);
  }
}

export { revertCommit };
