import type { CreateItemBody, Item } from "../types/item";
import type { ClaimWithUser } from "../types/claim";
import { apiRequest } from "./client";

export function getItems() {
  return apiRequest<Item[]>("/api/items");
}

export function getMyItems() {
  return apiRequest<Item[]>("/api/items/my");
}

export function getItemById(id: string | number) {
  return apiRequest<Item>(`/api/items/${id}`);
}

export async function createItem(payload: CreateItemBody) {
  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("type", payload.type);
  formData.append("location", payload.location);
  formData.append("date", payload.date);
  if (payload.description) formData.append("description", payload.description);
  if (payload.category) formData.append("category", payload.category);
  payload.images?.forEach((file) => formData.append("images", file));

  return apiRequest<{ itemId: number }>("/api/items", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export function deleteItem(id: string | number) {
  return apiRequest<{ message: string }>(`/api/items/${id}`, {
    method: "DELETE",
  });
}

export function createClaim(id: string | number, message?: string) {
  return apiRequest<{ claimId: number }>(`/api/items/${id}/claim`, {
    method: "POST",
    body: { message },
  });
}

export function getItemClaims(id: string | number) {
  return apiRequest<ClaimWithUser[]>(`/api/items/${id}/claims`);
}
