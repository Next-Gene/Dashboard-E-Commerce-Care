export interface Category {
  id: number;
  name: string;
  slug: string;
  categoryPhoto: string | null;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
}
export type APICategoriesResponse = Category[];