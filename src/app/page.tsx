import Link from 'next/link';
import { getAllIssues } from '@/lib/data';
import { BookOpen, Calendar, ArrowRight } from 'lucide-react';

export default function Home() {
  const issues = getAllIssues();

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">全部期刊</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">共 {issues.length} 期内容</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {issues.map((issue) => (
          <Link 
            key={issue.id} 
            href={`/issue/${issue.id}`}
            className="group block bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-200 overflow-hidden flex flex-col h-full"
          >
            {/* Card Header with Image */}
            <div className="relative aspect-video w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {issue.coverImage ? (
                <img 
                  src={issue.coverImage} 
                  alt={`Cover for issue ${issue.id}`}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-300 dark:text-slate-600">
                  <BookOpen className="h-12 w-12" />
                </div>
              )}
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-sm backdrop-blur-sm">
                  第 {issue.id} 期
                </span>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 flex flex-col flex-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-3">
                {issue.title.replace(/^科技爱好者周刊（第 \d+ 期）：/, '') || `科技爱好者周刊 第 ${issue.id} 期`}
              </h2>
              
              {issue.summary && (
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1">
                  {issue.summary}
                </p>
              )}
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                {issue.categories && issue.categories.filter(c => c !== 'Intro' && c !== '封面图').slice(0, 3).map(cat => (
                  <span key={cat} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                    {cat}
                  </span>
                ))}
                {issue.categories && issue.categories.filter(c => c !== 'Intro' && c !== '封面图').length > 3 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500 px-1 py-1">+{issue.categories.filter(c => c !== 'Intro' && c !== '封面图').length - 3}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
