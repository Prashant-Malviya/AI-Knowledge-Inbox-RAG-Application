import { KnowledgeItem } from "../types";

interface ItemsListProps {
  items: KnowledgeItem[];
  isLoading: boolean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ItemsList({ items, isLoading }: ItemsListProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading saved items…</p>;
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Nothing saved yet — add a note or URL to get started.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="bg-white border border-slate-200 rounded-lg p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="text-sm font-medium text-slate-800 leading-snug">{item.title}</span>
            <span
              className={`shrink-0 text-[10px] uppercase tracking-wide font-semibold px-1.5 py-0.5 rounded ${
                item.type === "note" ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"
              }`}
            >
              {item.type}
            </span>
          </div>
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-600 hover:underline break-all"
            >
              {item.sourceUrl}
            </a>
          )}
          <div className="mt-1 text-xs text-slate-400">
            {formatDate(item.createdAt)} · {item.chunkCount} chunk{item.chunkCount === 1 ? "" : "s"} ·{" "}
            {item.contentLength} chars
          </div>
        </li>
      ))}
    </ul>
  );
}
