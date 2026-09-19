import path from "node:path";
import { migrateGhostContent } from "./content-migration.mjs";

const sourceFlag = process.argv.indexOf("--source");
const sourceRoot = sourceFlag === -1 ? undefined : process.argv[sourceFlag + 1];

if (!sourceRoot) {
  throw new Error("Usage: node scripts/migrate-ghost-content.mjs --source /path/to/ghost-recovery");
}

const migrated = await migrateGhostContent({
  sourceRoot: path.resolve(sourceRoot),
  projectRoot: process.cwd(),
});

console.log(`Migrated ${migrated.length} published posts: ${migrated.join(", ")}`);
