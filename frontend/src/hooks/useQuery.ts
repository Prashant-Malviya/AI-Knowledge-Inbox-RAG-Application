import { useCallback, useState } from "react";
import { api, ApiError } from "../api/client";
import { QueryResult } from "../types";

interface UseQueryState {
  result: QueryResult | null;
  isLoading: boolean;
  error: string | null;
}

export function useAskQuestion() {
  const [state, setState] = useState<UseQueryState>({
    result: null,
    isLoading: false,
    error: null,
  });

  const ask = useCallback(async (question: string) => {
    setState({ result: null, isLoading: true, error: null });
    try {
      const result = await api.query(question);
      setState({ result, isLoading: false, error: null });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to get an answer.";
      setState({ result: null, isLoading: false, error: message });
    }
  }, []);

  return { ...state, ask };
}
