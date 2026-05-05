/**
 * Database layer: persistence, repositories, and domain types.
 * Replace file-backed repositories with a real DB without changing HTTP handlers.
 */
export type * from "./types";
export {
  ensureProductsFile,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./products.repository";
export { ensureSiteConfigFile, getSiteConfig, saveSiteConfig } from "./site-config.repository";
export { ensureDataDirectory, getDataDirectory, getProjectRoot } from "./paths";
