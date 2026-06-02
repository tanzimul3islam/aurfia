import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages: (number | 'dots')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'dots') {
      pages.push('dots');
    }
  }

  const btn = (page: number, disabled: boolean, children: React.ReactNode) => (
    <button
      onClick={() => onPageChange(page)}
      disabled={disabled}
      className="w-9 h-9 flex items-center justify-center text-sm border border-black/10 hover:border-black/30 disabled:opacity-30 disabled:cursor-default transition-colors"
    >
      {children}
    </button>
  );

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      {btn(currentPage - 1, currentPage === 1, <ChevronLeft size={16} />)}
      {pages.map((p, i) =>
        p === 'dots' ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-neutral-400">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 flex items-center justify-center text-sm border transition-colors ${
              p === currentPage
                ? 'border-black bg-black text-white'
                : 'border-black/10 hover:border-black/30'
            }`}
          >
            {p}
          </button>
        ),
      )}
      {btn(currentPage + 1, currentPage === totalPages, <ChevronRight size={16} />)}
    </div>
  );
}
