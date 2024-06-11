import { okAsync as OkAsync, ResultAsync } from "neverthrow";

import { PendingPurchaseOrder, PurchaseOrder } from "./PurchaseOrder";
import { PurchaseOrderSelector } from "./PurchaseOrderSelector";

export const MemoryPurchaseOrderSelector = {
  new: (db: { purchaseOrders: PurchaseOrder[] }): PurchaseOrderSelector => ({
    listPending: (): ResultAsync<PendingPurchaseOrder[], Error> =>
      OkAsync(db.purchaseOrders.filter(PurchaseOrder.isPending)),
  }),
};
