export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <button
        className="btn btn-outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ◀ Prev
      </button>

      <span style={{ color: "#a8b3cf" }}>
        Page <b>{page}</b> / {totalPages || 1}
      </span>

      <button
        className="btn btn-outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next ▶
      </button>
    </div>
  );
}
