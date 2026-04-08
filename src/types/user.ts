export type AuthUser = {
  email: string;
  name: string;
};

export type UserProfile = {
  email: string;
  name: string;
  phone: string | null;
  avatarUrl: string | null;
};
