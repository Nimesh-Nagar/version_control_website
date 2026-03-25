import fs from "fs/promises";
import path from "path";

import { s3, S3_BUCKET } from "../config/aws-config.js";

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".myGit");
  const commitsPaths = path.join(repoPath, "commits");

  try {
    const data = await s3
      .listObjectsV2({
        Bucket: S3_BUCKET,
        Prefix: "commits/",
      })
      .promise();

    const objects = data.Contents || [];
    for (const obj of objects) {
      const key = obj.Key;
      const filePath = path.join(repoPath, key);
      const dirPath = path.dirname(filePath);

      await fs.mkdir(dirPath, { recursive: true });

      const fileData = await s3
        .getObject({
          Bucket: S3_BUCKET,
          Key: key,
        })
        .promise();

      await fs.writeFile(filePath, fileData.Body);

      console.log(`Pulled ${key} from S3 and saved to ${filePath}`);
    }
  } catch (error) {
    console.log("Error in pulling from S3 : ", error);
  }
}

export { pullRepo };
