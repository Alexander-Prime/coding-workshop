import { ResultAsync } from "neverthrow";

import { PendingPurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderSelector } from "../domain/PurchaseOrderSelector";

export const listPendingPos =
  ({ POSelector }: { POSelector: PurchaseOrderSelector }) =>
  (): ResultAsync<PendingPurchaseOrder[], Error> =>
    POSelector.listPending();
