import { getIssueById, getAllIssues } from '@/lib/data';
import Markdown from '@/components/Markdown';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const issues = getAllIssues();
  return issues.map((issue) => ({
    id: issue.id.toString(),
  }));
}

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const issueId = parseInt(id);
  const issue = getIssueById(issueId);
  
  if (!issue) {
    notFound();
  }

  // Get prev/next issue
  const prevIssue = getIssueById(issueId - 1);
  const nextIssue = getIssueById(issueId + 1);

  return (
    <article className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回列表
        </Link>
        
        <div className="flex gap-2">
          {prevIssue ? (
             <Link 
              href={`/issue/${prevIssue.id}`} 
              className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700"
              title={`上一期: ${prevIssue.title}`}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              <span className="hidden sm:inline">上一期</span>
            </Link>
          ) : <span className="w-20"></span>}
          
          {nextIssue && (
             <Link 
              href={`/issue/${nextIssue.id}`} 
              className="inline-flex items-center text-sm text-slate-500 hover:text-blue-600 transition-colors bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-700"
              title={`下一期: ${nextIssue.title}`}
            >
              <span className="hidden sm:inline">下一期</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
      </div>

      <header className="mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-4">
           <span className="bg-blue-600 text-white px-3 py-1 rounded-md font-bold text-sm shadow-sm">
            第 {issue.id} 期
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-sm flex items-center">
             <Calendar className="h-3 w-3 mr-1" />
             {/* Date placeholder if we had it */}
             周刊归档
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
          {issue.title.replace(/^科技爱好者周刊（第 \d+ 期）：/, '') || `科技爱好者周刊 第 ${issue.id} 期`}
        </h1>
      </header>

      <div className="space-y-16">
        {Object.entries(issue.sections).map(([category, contents], index) => {
           // Skip empty sections
           if (!contents || contents.length === 0) return null;
           
           const isIntro = category === 'Intro';
           
           return (
            <section key={category + index} className="scroll-mt-24 relative" id={category}>
              {!isIntro && (
                <div className="flex items-center mb-6">
                   <div className="h-8 w-1 bg-blue-500 rounded-full mr-3"></div>
                   <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">{category}</h2>
                </div>
              )}
              
              <div className="space-y-8">
                {contents.map((content, idx) => (
                  <div key={idx} className="prose-container bg-white dark:bg-slate-900 rounded-xl p-6 md:p-8 shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
                    <Markdown content={content} />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
      
      {/* Footer Navigation */}
      <div className="mt-16 pt-8 border-t border-slate-200 flex justify-between items-center">
        {prevIssue ? (
          <Link href={`/issue/${prevIssue.id}`} className="group flex flex-col items-start max-w-[45%]">
            <span className="text-xs text-slate-400 mb-1 group-hover:text-blue-500 flex items-center">
              <ArrowLeft className="h-3 w-3 mr-1" /> 上一期
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 line-clamp-2">
              {prevIssue.title}
            </span>
          </Link>
        ) : <div></div>}

        {nextIssue && (
          <Link href={`/issue/${nextIssue.id}`} className="group flex flex-col items-end max-w-[45%] text-right">
            <span className="text-xs text-slate-400 mb-1 group-hover:text-blue-500 flex items-center">
              下一期 <ArrowRight className="h-3 w-3 ml-1" />
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600 line-clamp-2">
              {nextIssue.title}
            </span>
          </Link>
        )}
      </div>
    </article>
  );
}
