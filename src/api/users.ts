import type { UserProfile } from "../types/user";
import { apiRequest } from "./client";

export function getProfile() {
  return apiRequest<UserProfile>("/api/users/profile");
}

export async function updateProfile(payload: {
  name?: string;
  phone?: string;
  profilePic?: File;
}) {
  const formData = new FormData();
  if (payload.name) formData.append("name", payload.name);
  if (payload.phone) formData.append("phone", payload.phone);
  if (payload.profilePic) formData.append("profilePic", payload.profilePic);

  return apiRequest<UserProfile>("/api/users/update", {
    method: "PUT",
    body: formData,
    isFormData: true,
  });
}
