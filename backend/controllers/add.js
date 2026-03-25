import fs from "fs/promises";
import path from "path";

async function addFile(filePath) {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });
    const fileName = path.basename(filePath);
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} is added to staging Area`);
  } catch (error) {
    console.log(`Error adding file to Staging area ${error}`);
  }
}
export { addFile };
