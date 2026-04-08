import type { AuthUser } from "./user";

export type AuthPayload = {
  token: string;
  user: AuthUser;
};

export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  email: string;
  password: string;
  name: string;
};
