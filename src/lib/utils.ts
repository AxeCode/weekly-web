import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { pinyin } from "pinyin-pro"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  let str = text.toString().trim()
  // Convert Chinese to pinyin (ASCII) to produce English paths
  // Keep non-Chinese characters as-is; then normalize
  const hasCJK = /[\u3400-\u9FFF]/.test(str)
  if (hasCJK) {
    // pinyin without tone, segment by space; fallback to original for non-CJK
    str = pinyin(str, { toneType: 'none', separator: ' ' })
  }
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')      // spaces to hyphen
    .replace(/&/g, '-and-')    // & to and
    .replace(/[^a-z0-9\-]+/g, '') // strip non-ascii except hyphen
    .replace(/\-+/g, '-')      // collapse multiple hyphens
    .replace(/^\-|\-$/g, '');  // trim hyphens
}
