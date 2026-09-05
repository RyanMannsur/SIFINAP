export interface ArticleCardAction {
  id: string;
  label: string;
  icon?: string;
  danger?: boolean;
  disabled?: boolean;
}

export interface DummyArticle {
  id?: number;
  authorId?: number;
  imageUrl: string;
  date: string;
  updatedAt?: string;
  title: string;
  content?: string;
  summary?: string | null;
  author: string;
  authorAvatar?: string | null;
  authorBio?: string | null;
  category: string;
  categoryLabel?: string;
  categoryIcon: string;
  rating: number;
  actions?: ArticleCardAction[];
}
