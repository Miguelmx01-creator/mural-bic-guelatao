'use client';

import { Camera } from 'lucide-react';
import { getCategoryById } from '@/lib/categories';

interface Props {
  categoryId: string;
}

export default function CategoryBanner({ categoryId }: Props) {
  const cat = getCategoryById(categoryId);
  if (!cat) return null;

  return (
    <div
      className="mx-4 mt-3 mb-1 rounded-xl overflow-hidden border shadow-sm flex-shrink-0"
      style={{ borderColor: `${cat.bg}33` }}
    >
      <div className="h-1.5 w-full" style={{ backgroundColor: cat.bg }} />
      <div className="px-4 py-3 bg-white/90 flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: `${cat.bg}18`, color: cat.bg }}
        >
          <Camera className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-gray-800">{cat.label}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-snug">{cat.imageHint}</p>
        </div>
      </div>
    </div>
  );
}
