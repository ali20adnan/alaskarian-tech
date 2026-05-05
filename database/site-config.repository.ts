import fs from "node:fs";
import path from "node:path";

import { readJsonFile, writeJsonFile } from "./json-io";
import { ensureDataDirectory, getDataDirectory, getProjectRoot, getSeedsDirectory } from "./paths";
import type { SiteConfig } from "./types";

const FILE_NAME = "site-config.json";

function configPath(): string {
  return path.join(getDataDirectory(), FILE_NAME);
}

function legacyRootConfigPath(): string {
  return path.join(getProjectRoot(), "site-config.json");
}

function seedPath(): string {
  return path.join(getSeedsDirectory(), "default-site-config.json");
}

export function ensureSiteConfigFile(): void {
  ensureDataDirectory();
  const target = configPath();
  if (fs.existsSync(target)) return;

  const legacy = legacyRootConfigPath();
  if (fs.existsSync(legacy)) {
    fs.copyFileSync(legacy, target);
    return;
  }

  const seed = readJsonFile<SiteConfig>(seedPath());
  writeJsonFile(target, seed);
}

export function getSiteConfig(): SiteConfig {
  ensureSiteConfigFile();
  return readJsonFile<SiteConfig>(configPath());
}

export function saveSiteConfig(config: SiteConfig): void {
  ensureDataDirectory();
  writeJsonFile(configPath(), config);
}
