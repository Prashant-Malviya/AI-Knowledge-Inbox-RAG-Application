import { QueryResult } from "../types";

interface AnswerDisplayProps {
  result: QueryResult | null;
  error: string | null;
}

export function AnswerDisplay({ result, error }: AnswerDisplayProps) {
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-md p-3">
        {error}
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-3">
      <div className="bg-white border border-slate-200 rounded-lg p-4">
        {result.usedFallbackAi && (
          <div className="mb-2 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
            No OpenAI key configured — showing retrieved excerpts instead of an LLM-generated answer.
          </div>
        )}
        <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">{result.answer}</p>
      </div>

      {result.sources.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Sources
          </h3>
          <ul className="space-y-2">
            {result.sources.map((source, i) => (
              <li key={`${source.itemId}-${source.chunkIndex}`} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-700">
                    [{i + 1}] {source.title}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    score {source.score.toFixed(3)}
                  </span>
                </div>
                {source.sourceUrl && (
                  <a
                    href={source.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline break-all"
                  >
                    {source.sourceUrl}
                  </a>
                )}
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{source.snippet}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
