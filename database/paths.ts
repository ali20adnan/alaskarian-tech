import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DATABASE_DIR = path.dirname(fileURLToPath(import.meta.url));

/** Repository root (folder that contains `frontend`, `backend`, `database`). */
export function getProjectRoot(): string {
  return path.resolve(DATABASE_DIR, "..");
}

/** Directory where JSON data files are stored. */
export function getDataDirectory(): string {
  const override = process.env.DATABASE_DATA_DIR;
  if (override) {
    return path.isAbsolute(override)
      ? override
      : path.resolve(process.cwd(), override);
  }
  return path.join(DATABASE_DIR, "data");
}

export function getSeedsDirectory(): string {
  return path.join(DATABASE_DIR, "seeds");
}

export function ensureDataDirectory(): void {
  fs.mkdirSync(getDataDirectory(), { recursive: true });
}
