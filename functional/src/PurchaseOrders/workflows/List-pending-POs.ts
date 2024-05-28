import { ResultAsync } from "neverthrow";

import { PendingPurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";

export const listPendingPos =
  ({ PORepo }: { PORepo: PurchaseOrderRepo }) =>
  (): ResultAsync<PendingPurchaseOrder[], Error> =>
    PORepo.list<PendingPurchaseOrder>({ isSubmitted: true });
