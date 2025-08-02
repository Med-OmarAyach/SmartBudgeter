// models/category.model.ts
export interface Category {
  id: number;
  user_id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name?: string;
}