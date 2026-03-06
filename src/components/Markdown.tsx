import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export default async function Markdown({ content }: { content: string }) {
  const processedContent = await remark()
    .use(html)
    .use(gfm)
    .process(content);
  
  const contentHtml = processedContent.toString();

  return (
    <div 
      className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg"
      dangerouslySetInnerHTML={{ __html: contentHtml }} 
    />
  );
}
