import fs from "fs/promises";
import path from "path";

const repoPath = path.resolve(process.cwd(), ".myGit");
console.log(repoPath);

const dir = path.join(repoPath, "testing");
console.log(dir);
