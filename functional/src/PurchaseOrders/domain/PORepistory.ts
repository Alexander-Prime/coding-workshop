import { ok } from "neverthrow";

import { None, Option, Some } from "../../utilities/option";
import { UUID } from "../../utilities/uuid";
import { IPORepository } from "./IPORepository";
import { PurchaseOrder } from "./PurchaseOrder";

class PORepository implements IPORepository {
  purchaseOrders: PurchaseOrder[] = [];
  async save(po: PurchaseOrder) {
    this.purchaseOrders.push(po);
    return ok(undefined);
  }
  async fetch(id: UUID) {
    const po = this.purchaseOrders.find((p) => p.id === id);
    return po ? ok(Some(po)) : ok(None);
  }
}
export const _constructPORepository = () => new PORepository();

export const constructPORepository = (): IPORepository => {
  const purchaseOrders: PurchaseOrder[] = [];
  return {
    save: async (po: PurchaseOrder) => {
      purchaseOrders.push(po);
      return ok(undefined);
    },
    fetch: async (id: UUID) => {
      return ok(Option.nonNull(purchaseOrders.find((p) => p.id === id)));
    },
  };
};
