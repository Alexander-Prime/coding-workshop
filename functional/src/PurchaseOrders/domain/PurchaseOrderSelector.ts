import { ResultAsync } from "neverthrow";

import { PendingPurchaseOrder } from "./PurchaseOrder";

export type PurchaseOrderSelector = {
  listPending: () => ResultAsync<PendingPurchaseOrder[], Error>;
};
