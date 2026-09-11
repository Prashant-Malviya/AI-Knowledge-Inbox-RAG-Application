import { KnowledgeItem } from "../types";
import { NotFoundError } from "../utils/errors";

//In Memory Item Store
class ItemStore {
  private items = new Map<string, KnowledgeItem>();

  add(item: KnowledgeItem): void {
    this.items.set(item.id, item);
  }

  getAll(): KnowledgeItem[] {
    return [...this.items.values()].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  getById(id: string): KnowledgeItem {
    const item = this.items.get(id);
    if (!item) throw new NotFoundError(`Item "${id}" not found.`);
    return item;
  }

  count(): number {
    return this.items.size;
  }
}

export const itemStore = new ItemStore();
