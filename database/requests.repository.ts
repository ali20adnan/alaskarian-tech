import path from "node:path";
import { readJsonFile, writeJsonFile } from "./json-io";
import { ensureDataDirectory, getDataDirectory } from "./paths";

const FILE_NAME = "requests.json";

export interface SystemRequest {
  id: string;
  productId: string;
  productTitle: string;
  customerName: string;
  customerPhone: string;
  status: "pending" | "contacted" | "completed" | "cancelled";
  createdAt: string;
  notes?: string;
}

function requestsPath(): string {
  return path.join(getDataDirectory(), FILE_NAME);
}

export function listRequests(): SystemRequest[] {
  ensureDataDirectory();
  try {
    return readJsonFile<SystemRequest[]>(requestsPath());
  } catch {
    return [];
  }
}

export function createRequest(input: Omit<SystemRequest, "id" | "createdAt" | "status">): SystemRequest {
  const requests = listRequests();
  const request: SystemRequest = {
    ...input,
    id: `req_${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  requests.push(request);
  writeJsonFile(requestsPath(), requests);
  return request;
}

export function updateRequestStatus(id: string, status: SystemRequest["status"]): void {
  const requests = listRequests().map((r) =>
    r.id === id ? { ...r, status } : r
  );
  writeJsonFile(requestsPath(), requests);
}

export function deleteRequest(id: string): void {
  const requests = listRequests().filter((r) => r.id !== id);
  writeJsonFile(requestsPath(), requests);
}
