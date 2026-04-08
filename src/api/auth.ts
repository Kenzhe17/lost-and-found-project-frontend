import { apiRequest } from "./client";
import type { AuthPayload, LoginBody, RegisterBody } from "../types/auth";

export function login(body: LoginBody) {
  return apiRequest<AuthPayload>("/api/auth/login", {
    method: "POST",
    body,
    withAuth: false,
  });
}

export function register(body: RegisterBody) {
  return apiRequest<AuthPayload>("/api/auth/register", {
    method: "POST",
    body,
    withAuth: false,
  });
}
