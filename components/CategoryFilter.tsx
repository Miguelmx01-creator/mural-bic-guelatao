'use client';

import { CATEGORIES } from '@/lib/categories';

interface Props {
  selected: string | null;
  onChange: (id: string | null) => void;
}

export default function CategoryFilter({ selected, onChange }: Props) {
  return (
    <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-ochre/20 bg-cream/80 backdrop-blur-sm flex-shrink-0">
      <button
        onClick={() => onChange(null)}
        className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
          selected === null
            ? 'bg-pine-green text-cream shadow-sm'
            : 'bg-white/70 text-gray-600 hover:bg-white border border-gray-200'
        }`}
      >
        Todas
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(selected === cat.id ? null : cat.id)}
          style={
            selected === cat.id
              ? { backgroundColor: cat.bg, color: cat.text }
              : {}
          }
          className={`whitespace-nowrap px-3 py-1 rounded-full text-sm font-medium transition-all flex-shrink-0 border ${
            selected === cat.id
              ? 'shadow-sm border-transparent'
              : 'bg-white/70 text-gray-600 hover:bg-white border-gray-200'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
