import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, onPageChange }) {
  // Prevent going out of bounds visually
  const isFirst = page <= 1;
  const isLast = page >= totalPages;

  return (
    <div className="pagination-root">
      <button
        className="icon-btn"
        disabled={isFirst}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous Page"
      >
        <ChevronLeft size={16} />
      </button>

      <span className="page-info">
        Page <span className="current">{page}</span> of {totalPages || 1}
      </span>

      <button
        className="icon-btn"
        disabled={isLast}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next Page"
      >
        <ChevronRight size={16} />
      </button>

      <style>{`
        /* --- STYLES --- */
        .pagination-root {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'Inter', sans-serif;
          background: #121214; /* Matches card background */
          padding: 4px 6px;
          border-radius: 8px;
          border: 1px solid #27272a;
          width: fit-content;
        }

        .icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: transparent;
          border: 1px solid transparent; /* Invisible border for layout stability */
          color: #a1a1aa; /* Muted text */
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .icon-btn:hover:not(:disabled) {
          background: #27272a;
          color: #ededef;
          border-color: #3f3f46;
        }

        .icon-btn:active:not(:disabled) {
          transform: scale(0.96);
          background: #18181b;
        }

        .icon-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
          pointer-events: none;
        }

        .page-info {
          font-size: 0.85rem;
          color: #71717a;
          font-variant-numeric: tabular-nums; /* Keeps numbers monospaced */
          user-select: none;
          min-width: 80px;
          text-align: center;
        }

        .current {
          color: #ededef; /* Highlight current page */
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}