import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function commitChanges(message) {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitId = uuidv4();
    const commitDir = path.join(commitPath, commitId);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file),
      );
    }

    await fs.writeFile(
      path.join(commitDir, "config.json"),
      JSON.stringify({
        message,
        date: new Date().toISOString(),
      }),
    );

    console.log(`commit ${commitId} created with message : ${message} `);
  } catch (error) {
    console.log(`Error commiting files :: ${error}`);
  }
}

export { commitChanges };
