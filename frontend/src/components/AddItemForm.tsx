import { FormEvent, useState } from "react";

interface AddItemFormProps {
  isSubmitting: boolean;
  onAddNote: (content: string, title?: string) => Promise<void>;
  onAddUrl: (url: string, title?: string) => Promise<void>;
}

type Mode = "note" | "url";

export function AddItemForm({ isSubmitting, onAddNote, onAddUrl }: AddItemFormProps) {
  const [mode, setMode] = useState<Mode>("note");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    if (mode === "note") {
      await onAddNote(value.trim(), title.trim() || undefined);
    } else {
      await onAddUrl(value.trim(), title.trim() || undefined);
    }
    setValue("");
    setTitle("");
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setMode("note")}
          className={`px-3 py-1.5 text-sm rounded-md font-medium ${
            mode === "note" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          Note
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`px-3 py-1.5 text-sm rounded-md font-medium ${
            mode === "url" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
          }`}
        >
          URL
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
        />

        {mode === "note" ? (
          <textarea
            placeholder="Paste or write a note…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={4}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        ) : (
          <input
            type="text"
            placeholder="https://example.com/article"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        )}

        <button
          type="submit"
          disabled={isSubmitting || !value.trim()}
          className="w-full bg-slate-900 text-white rounded-md py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
        >
          {isSubmitting ? "Saving…" : mode === "note" ? "Save note" : "Fetch & save URL"}
        </button>
      </form>
    </div>
  );
}
