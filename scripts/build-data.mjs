import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { pinyin } from 'pinyin-pro';

const CONTENT_DIR = path.join(process.cwd(), '../weekly-master/docs');
const DATA_DIR = path.join(process.cwd(), 'src/data');

// Ensure output directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper to write JSON file
function writeJson(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Slugify function to match the one in utils.ts (simplified)
function slugify(text) {
  // Convert Chinese to pinyin first
  const pinyinText = pinyin(text, { toneType: 'none', type: 'array' }).join('-');
  
  return pinyinText
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/&/g, '-and-')   // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-');  // Replace multiple - with single -
}

async function processMarkdown(content) {
  // Use remark to process markdown to HTML
  const processedContent = await remark()
    .use(html)
    .use(gfm)
    .process(content);
  return processedContent.toString();
}

function parseIssue(filename, content) {
  const issueMatch = filename.match(/issue-(\d+)\.md/);
  const issueNumber = issueMatch ? parseInt(issueMatch[1]) : 0;

  const lines = content.split('\n');
  let title = '';
  let currentSection = 'Intro';
  let sections = {};
  let buffer = [];
  
  // Try to find title in first few lines (H1)
  for (let i = 0; i < 10 && i < lines.length; i++) {
    if (lines[i].startsWith('# ')) {
      title = lines[i].substring(2).trim();
      break;
    }
  }

  lines.forEach(line => {
    if (line.startsWith('## ')) {
      // Flush previous section
      if (currentSection) {
        if (!sections[currentSection]) sections[currentSection] = [];
        if (buffer.length > 0) {
          sections[currentSection].push(buffer.join('\n'));
        }
      }
      
      // Start new section
      currentSection = line.substring(3).trim();
      buffer = [];
    } else {
      // Filter logic for Intro section
      if (currentSection === 'Intro') {
        const trimmedLine = line.trim();
        // Skip title line
        if (trimmedLine.startsWith('# ')) return;
        
        // Skip boilerplate intro lines
         if (trimmedLine.includes('这里记录每周值得分享的科技内容')) return;
         if (trimmedLine.includes('本杂志') && trimmedLine.includes('开源')) return;
         if (trimmedLine.includes('欢迎') && trimmedLine.includes('投稿')) return;
         if (trimmedLine.includes('谁在招人')) return;
         if (trimmedLine.includes('合作请') && trimmedLine.includes('联系')) return;
       }
      
      buffer.push(line);
    }
  });
  
  // Flush last section
  if (currentSection && buffer.length > 0) {
    if (!sections[currentSection]) sections[currentSection] = [];
    sections[currentSection].push(buffer.join('\n'));
  }

  // Extract cover image from "封面图" section if available
  let coverImage = '';
  if (sections['封面图'] && sections['封面图'].length > 0) {
    const coverContent = sections['封面图'][0];
    const imgMatch = coverContent.match(/!\[.*?\]\((.*?)\)/);
    if (imgMatch) {
      coverImage = imgMatch[1];
    }
  }

  // Extract summary from "Intro" section or fallback
  let summary = '';
  
  // Try Intro first
  if (sections['Intro'] && sections['Intro'].length > 0) {
    const introContent = sections['Intro'][0];
    const introLines = introContent.split('\n').filter(l => l.trim() && !l.startsWith('# '));
    if (introLines.length > 0) {
      summary = introLines[0];
    }
  }
  
  // Fallback to other sections if summary is empty
  if (!summary) {
    // Priority: "卷首语", or section matching issue title (minus prefix), or first non-meta section
    const titleWithoutPrefix = title.replace(/^科技爱好者周刊（第 \d+ 期）：/, '').trim();
    
    if (sections['卷首语'] && sections['卷首语'].length > 0) {
      const lines = sections['卷首语'][0].split('\n').filter(l => l.trim());
      if (lines.length > 0) summary = lines[0];
    } else if (titleWithoutPrefix && sections[titleWithoutPrefix] && sections[titleWithoutPrefix].length > 0) {
      const lines = sections[titleWithoutPrefix][0].split('\n').filter(l => l.trim());
      if (lines.length > 0) summary = lines[0];
    } else {
      // Find first valid section
      for (const section of Object.keys(sections)) {
        if (['Intro', '封面图', '往年回顾', '订阅'].includes(section)) continue;
        if (sections[section] && sections[section].length > 0) {
          const lines = sections[section][0].split('\n').filter(l => l.trim());
          if (lines.length > 0) {
            summary = lines[0];
            break;
          }
        }
      }
    }
  }
  
  // Truncate summary
  if (summary) {
    summary = summary.substring(0, 150) + (summary.length > 150 ? '...' : '');
  }

  // Clean up empty Intro
  if (sections['Intro']) {
    const introContent = sections['Intro'].join('').trim();
    if (!introContent) {
      delete sections['Intro'];
    }
  }

  return {
    id: issueNumber,
    filename,
    title,
    sections, // Map of Category -> [ContentBlock1, ContentBlock2...]
    coverImage,
    summary
  };
}

async function main() {
  console.log('Building data from:', CONTENT_DIR);
  
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.match(/^issue-\d+\.md$/));
  const issues = [];
  const categories = {}; // Map<Category, Array<{issueId, content}>>

  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent); // Use gray-matter just in case, though usually empty
    
    const parsed = parseIssue(file, content);
    issues.push({
      id: parsed.id,
      title: parsed.title,
      sections: parsed.sections,
      coverImage: parsed.coverImage,
      summary: parsed.summary
    });

    // Aggregate categories
    Object.keys(parsed.sections).forEach(cat => {
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push({
        issueId: parsed.id,
        issueTitle: parsed.title,
        content: parsed.sections[cat].join('\n')
      });
    });
  }

  // Sort issues by ID desc
  issues.sort((a, b) => b.id - a.id);

  // Sort categories alphabetically or by frequency?
  // Let's keep them as a map.
  
  // Write individual issue files and collect index data
  const issuesIndex = [];
  
  for (const issue of issues) {
    // Write full issue data to separate file
    writeJson(`issues/${issue.id}.json`, issue);
    
    // Add to index (lightweight)
    issuesIndex.push({
      id: issue.id,
      title: issue.title,
      categories: Object.keys(issue.sections),
      coverImage: issue.coverImage,
      summary: issue.summary
    });
  }
  
  // Write issues index
  writeJson('issues-index.json', issuesIndex);

  // Process categories
  const categoryList = [];
  
  for (const [name, items] of Object.entries(categories)) {
    if (name === 'Intro' || name === '封面图' || name === '往年回顾' || name === '订阅') continue;
    
    const slug = slugify(name);
    if (!slug) continue;
    
    const categoryData = {
      name,
      slug,
      count: items.length,
      items: items // This contains all items for this category
    };
    
    // Write category file
    writeJson(`categories/${slug}.json`, categoryData);
    
    // Add to index
    categoryList.push({
      name,
      slug,
      count: items.length
    });
  }
  
  // Sort categories by count
  categoryList.sort((a, b) => b.count - a.count);
  
  // Write categories index
  writeJson('categories-index.json', categoryList);

  console.log(`Generated data for ${issues.length} issues and ${categoryList.length} categories.`);
}

main().catch(console.error);
