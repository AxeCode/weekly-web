import { getCategoryBySlug, getAllCategories } from '@/lib/data';
import Markdown from '@/components/Markdown';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen, Hash } from 'lucide-react';

export async function generateStaticParams() {
  const categories = getAllCategories();
  // Filter out any categories that might result in empty slugs or problematic paths
  return categories
    .filter(cat => cat.slug && cat.slug.length > 0)
    .map((cat) => ({
      slug: cat.slug,
    }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const category = getCategoryBySlug(decodedSlug);

  if (!category) {
    notFound();
  }

  const sortedItems = [...category.items].sort((a, b) => b.issueId - a.issueId);

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <Link href="/" className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 mb-4 transition-colors dark:text-slate-400 dark:hover:text-blue-400">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首页
        </Link>
        
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Hash className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{category.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">共收录 {category.count} 篇内容</p>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {sortedItems.map((item, index) => (
          <article key={`${item.issueId}-${index}`} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
              <Link href={`/issue/${item.issueId}`} className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                <BookOpen className="h-3 w-3 mr-1" />
                第 {item.issueId} 期
              </Link>
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {item.issueTitle}
              </span>
            </div>
            
            <div className="p-6 md:p-8">
              <Markdown content={item.content} />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
