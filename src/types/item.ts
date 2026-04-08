export type ItemType = "LOST" | "FOUND";
export type ItemStatus = "OPEN" | "CLAIMED" | "RESOLVED";

export type Photo = {
  id: number;
  url: string;
  publicId: string;
  itemId: number;
};

export type Item = {
  id: number;
  title: string;
  description: string | null;
  type: ItemType;
  status: ItemStatus;
  location: string;
  date: string;
  category: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  photos: Photo[];
};

export type CreateItemBody = {
  title: string;
  description?: string;
  type: ItemType;
  location: string;
  date: string;
  category?: string;
  images?: File[];
};
