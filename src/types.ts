export interface Profile {
  id: string;
  full_name: string;
  bio: string;
  avatar_url: string;
  contact_email: string;
  twitter_url?: string;
  github_url?: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string;
  repo_url: string;
  live_url: string;
  tech_stack: string[];
  created_at: string;
  user_id: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image: string;
  published: boolean;
  created_at: string;
  updated_at: string;
  author_id: string;
}
