import {
  errAsync as ErrAsync,
  okAsync as OkAsync,
  ResultAsync,
} from "neverthrow";

import { Uuid } from "../../utilities/uuid";
import { PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";

export const submitPO =
  ({ PORepo }: { PORepo: PurchaseOrderRepo }) =>
  (id: Uuid): ResultAsync<null, Error> =>
    PORepo.fetch(id)
      .andThen((po) => po.okOr(new Error(`Purchase order not found: ${id}`)))
      .andThen((po) =>
        PurchaseOrder.isDraft(po)
          ? OkAsync(po)
          : ErrAsync(new Error(`Purchase order was already submitted: ${id}`))
      )
      .andThen((po) =>
        ResultAsync.combine([OkAsync(po), PORepo.nextPoNumber(po.org.prefix)])
      )
      .map(([po, poNumber]) => PurchaseOrder.submit(po, poNumber))
      .andThen(PORepo.save);
