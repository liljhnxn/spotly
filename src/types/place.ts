export type Category =
  | "Restaurants"
  | "Nature"
  | "Hotels"
  | "Entertainment"
  | "Hidden Gems";

export const CATEGORIES: Category[] = [
  "Restaurants",
  "Nature",
  "Hotels",
  "Entertainment",
  "Hidden Gems",
];

export interface Place {
  id: bigint;
  author: `0x${string}`;
  name: string;
  location: string;
  description: string;
  category: Category | string;
  imageUrl: string;
  createdAt: bigint;
  favouriteCount: bigint;
  exists: boolean;
  isRemoved: boolean;
}

export interface ToastMessage {
  id: string;
  type: "info" | "success" | "error" | "loading";
  title: string;
  message?: string;
  txHash?: string;
}

