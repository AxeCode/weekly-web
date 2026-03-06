import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'src/data');

export type Issue = {
  id: number;
  title: string;
  sections: Record<string, string[]>; // Category -> Content[]
};

export type IssueSummary = {
  id: number;
  title: string;
  categories: string[];
  coverImage?: string;
  summary?: string;
};

export type CategoryItem = {
  issueId: number;
  issueTitle: string;
  content: string;
};

export type Category = {
  name: string;
  slug: string;
  count: number;
  items: CategoryItem[];
};

export type CategorySummary = {
  name: string;
  slug: string;
  count: number;
};

// Helper to read JSON
function readJson<T>(filename: string): T {
  const filePath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(fileContent) as T;
}

export function getAllIssues(): IssueSummary[] {
  try {
    return readJson<IssueSummary[]>('issues-index.json');
  } catch (e) {
    console.error('Error loading issues index:', e);
    return [];
  }
}

export function getIssueById(id: number): Issue | undefined {
  try {
    return readJson<Issue>(`issues/${id}.json`);
  } catch (e) {
    return undefined;
  }
}

export function getAllCategories(): CategorySummary[] {
  try {
    return readJson<CategorySummary[]>('categories-index.json');
  } catch (e) {
    console.error('Error loading categories index:', e);
    return [];
  }
}

export function getCategoryBySlug(slug: string): Category | undefined {
  try {
    return readJson<Category>(`categories/${slug}.json`);
  } catch (e) {
    return undefined;
  }
}

export function getTopCategories(limit = 10): CategorySummary[] {
  const categories = getAllCategories();
  const priority = ['文章', '工具', '资源', '科技动态', '文摘', '言论', '图片'];
  
  const top = categories.filter(c => priority.includes(c.name));
  
  // Add others to fill limit
  const others = categories
    .filter(c => !priority.includes(c.name))
    //.sort((a, b) => b.count - a.count) // Already sorted in build script
    .slice(0, limit - top.length);
  
  return [...top, ...others];
}
