import { useItems } from "./hooks/useItems";
import { useAskQuestion } from "./hooks/useQuery";
import { AddItemForm } from "./components/AddItemForm";
import { ItemsList } from "./components/ItemsList";
import { QueryPanel } from "./components/QueryPanel";
import { AnswerDisplay } from "./components/AnswerDisplay";

export default function App() {
  const { items, isLoading, isSubmitting, error: itemsError, addNote, addUrl } = useItems();
  const { result, isLoading: isAsking, error: queryError, ask } = useAskQuestion();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-lg font-semibold text-slate-900">AI Knowledge Inbox</h1>
          <p className="text-sm text-slate-500">
            Save notes and URLs, then ask questions answered from your own content.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Add content</h2>
          <AddItemForm isSubmitting={isSubmitting} onAddNote={addNote} onAddUrl={addUrl} />
          {itemsError && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
              {itemsError}
            </div>
          )}

          <h2 className="text-sm font-semibold text-slate-700 pt-2">
            Saved items {items.length > 0 && <span className="text-slate-400">({items.length})</span>}
          </h2>
          <ItemsList items={items} isLoading={isLoading} />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Ask a question</h2>
          <QueryPanel isLoading={isAsking} onAsk={ask} />
          <AnswerDisplay result={result} error={queryError} />
        </section>
      </main>
    </div>
  );
}
