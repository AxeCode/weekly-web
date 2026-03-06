'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { 
  Menu, X, BookOpen, Hash, Home, ChevronRight, 
  FileText, Wrench, Library, Activity, Quote, MessageSquare, Image as ImageIcon,
  Zap, Layers
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type SidebarCategory = {
  name: string;
  slug: string;
  count: number;
};

const CATEGORY_ICONS: Record<string, any> = {
  '文章': FileText,
  '工具': Wrench,
  '资源': Library,
  '科技动态': Activity,
  '文摘': BookOpen,
  '言论': MessageSquare,
  '图片': ImageIcon,
};

export function Sidebar({ categories }: { categories: SidebarCategory[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Top categories hardcoded for order
  const featuredNames = ['文章', '工具', '资源', '科技动态', '文摘', '言论', '图片'];
  
  // Sort categories: featured first, then by count desc
  // Also filter out empty slugs which might cause key collision
  const sortedCategories = [...categories]
    .filter(c => c.slug && c.slug.length > 0)
    .sort((a, b) => {
      const indexA = featuredNames.indexOf(a.name);
      const indexB = featuredNames.indexOf(b.name);
      
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      return b.count - a.count;
    });

  const featured = sortedCategories.filter(c => featuredNames.includes(c.name));
  const others = sortedCategories.filter(c => !featuredNames.includes(c.name)).slice(0, 50); // Show top 50

  const NavLink = ({ href, children, icon: Icon, count, onClick }: { href: string; children: React.ReactNode; icon?: any; count?: number; onClick?: () => void }) => {
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
    return (
      <Link
        href={href}
        onClick={() => {
          setIsOpen(false);
          onClick?.();
        }}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group",
          isActive 
            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-100 shadow-sm" 
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
        )}
      >
        {Icon && <Icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 group-hover:text-slate-700 dark:text-slate-500 dark:group-hover:text-slate-300")} />}
        <span className="flex-1 truncate">{children}</span>
        {count !== undefined && (
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full font-medium transition-colors",
            isActive
              ? "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 dark:group-hover:text-slate-400"
          )}>
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Header/Button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-14 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b dark:border-slate-800 px-4">
        <div className="flex items-center">
          <button
            className="p-2 -ml-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
          <span className="ml-2 font-bold text-lg text-slate-900 dark:text-slate-100">Weekly Master</span>
        </div>
        <ThemeToggle />
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 bg-slate-50/50 dark:bg-slate-950/50 border-r border-slate-200 dark:border-slate-800 backdrop-blur-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:pt-0 pt-14"
        )}
      >
        <div className="p-6 pb-2 hidden lg:flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 font-bold text-xl text-slate-900 dark:text-slate-100 px-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <BookOpen className="h-5 w-5" />
            </div>
            <span>Weekly Master</span>
          </Link>
          <ThemeToggle />
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {/* Main Navigation */}
          <div className="space-y-1">
            <NavLink href="/" icon={Home}>全部期刊</NavLink>
          </div>

          {/* Featured Categories */}
          {featured.length > 0 && (
            <div>
              <h3 className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 flex items-center gap-2">
                <Zap className="h-3 w-3" />
                精选分类
              </h3>
              <div className="space-y-1">
                {featured.map((category) => (
                  <NavLink 
                    key={category.slug} 
                    href={`/category/${category.slug}`} 
                    icon={CATEGORY_ICONS[category.name] || Hash}
                    count={category.count}
                  >
                    {category.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}

          {/* More Categories */}
          {others.length > 0 && (
            <div>
              <h3 className="px-3 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-500 flex items-center gap-2">
                <Layers className="h-3 w-3" />
                更多分类
              </h3>
              <div className="space-y-1">
                {others.map((category) => (
                  <NavLink 
                    key={category.slug} 
                    href={`/category/${category.slug}`} 
                    icon={Hash}
                    count={category.count}
                  >
                    {category.name}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
