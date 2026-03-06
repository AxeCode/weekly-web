import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { getAllCategories } from "@/lib/data";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "蒙鼓上单",
  description: "阮一峰的科技爱好者周刊静态归档",
};

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = getAllCategories().map(c => ({
    name: c.name,
    slug: c.slug,
    count: c.count
  }));

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.className} flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Sidebar categories={categories} />
          <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8 lg:pt-8 pt-20 transition-all duration-300">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
