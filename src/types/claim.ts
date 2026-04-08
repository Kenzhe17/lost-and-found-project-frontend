import type { ItemStatus } from "./item";

export type ClaimStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type Claim = {
  id: number;
  itemId: number;
  userId: string;
  message: string | null;
  status: ClaimStatus;
  createdAt: string;
};

export type MyClaim = Claim & {
  item: {
    id: number;
    title: string;
    location: string;
    status: ItemStatus;
  };
};

export type ClaimWithUser = Claim & {
  user: {
    name: string;
    email: string;
    avatarUrl: string | null;
  };
};
