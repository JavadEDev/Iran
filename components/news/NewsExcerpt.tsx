"use client";

interface NewsExcerptProps {
  excerpt: string;
}

export function NewsExcerpt({ excerpt }: NewsExcerptProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{excerpt}</p>
    </div>
  );
}
