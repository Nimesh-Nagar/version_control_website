import fs from "fs/promises";
import path from "path";

import { s3, S3_BUCKET } from "../config/aws-config.js";

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const commitsPaths = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPaths);
    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPaths, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);
        const fileContent = await fs.readFile(filePath);

        const params = {
          Bucket: S3_BUCKET,
          Key: `commits/${commitDir}/${file}`,
          Body: fileContent,
        };
        const uploaded = await s3.upload(params).promise();
        console.log(uploaded);
      }
    }
  } catch (error) {
    console.log("Error in pushing to S3 : ", error);
  }
}

export { pushRepo };
