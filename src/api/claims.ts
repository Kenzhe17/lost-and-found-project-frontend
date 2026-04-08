import type { ClaimStatus, MyClaim } from "../types/claim";
import { apiRequest } from "./client";

export function getMyClaims() {
  return apiRequest<MyClaim[]>("/api/claims/my");
}

export function updateClaimStatus(id: string | number, status: Exclude<ClaimStatus, "PENDING">) {
  return apiRequest<{ id: number; status: ClaimStatus }>(`/api/claims/${id}`, {
    method: "PATCH",
    body: { status },
  });
}
