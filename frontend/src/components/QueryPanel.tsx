import { FormEvent, useState } from "react";

interface QueryPanelProps {
  isLoading: boolean;
  onAsk: (question: string) => Promise<void>;
}

export function QueryPanel({ isLoading, onAsk }: QueryPanelProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;
    await onAsk(question.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Ask a question about your saved content…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
      <button
        type="submit"
        disabled={isLoading || !question.trim()}
        className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-800 transition"
      >
        {isLoading ? "Thinking…" : "Ask"}
      </button>
    </form>
  );
}
