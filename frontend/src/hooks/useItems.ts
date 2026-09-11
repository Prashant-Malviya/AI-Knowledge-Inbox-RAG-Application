import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "../api/client";
import { KnowledgeItem } from "../types";

interface UseItemsState {
  items: KnowledgeItem[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export function useItems() {
  const [state, setState] = useState<UseItemsState>({
    items: [],
    isLoading: true,
    isSubmitting: false,
    error: null,
  });

  const refresh = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const { items } = await api.listItems();
      setState((s) => ({ ...s, items, isLoading: false }));
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to load items.";
      setState((s) => ({ ...s, isLoading: false, error: message }));
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addNote = useCallback(
    async (content: string, title?: string) => {
      setState((s) => ({ ...s, isSubmitting: true, error: null }));
      try {
        await api.ingestNote(content, title);
        await refresh();
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Failed to add note.";
        setState((s) => ({ ...s, error: message }));
      } finally {
        setState((s) => ({ ...s, isSubmitting: false }));
      }
    },
    [refresh]
  );

  const addUrl = useCallback(
    async (url: string, title?: string) => {
      setState((s) => ({ ...s, isSubmitting: true, error: null }));
      try {
        await api.ingestUrl(url, title);
        await refresh();
      } catch (err) {
        const message = err instanceof ApiError ? err.message : "Failed to add URL.";
        setState((s) => ({ ...s, error: message }));
      } finally {
        setState((s) => ({ ...s, isSubmitting: false }));
      }
    },
    [refresh]
  );

  return { ...state, addNote, addUrl, refresh };
}
