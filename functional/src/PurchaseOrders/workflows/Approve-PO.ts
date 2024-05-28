import {
  errAsync as ErrAsync,
  okAsync as OkAsync,
  Result,
  ResultAsync,
} from "neverthrow";

import { DomainInvariantViolation } from "../../utilities/error/DomainInvariantViolation";
import { Option } from "../../utilities/option";
import { Uuid } from "../../utilities/uuid";
import { PendingPurchaseOrder, PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";
import { Reviewer } from "../domain/Reviewer";

const ensureExists =
  (id: Uuid) =>
  (maybePurchaseOrder: Option<PurchaseOrder>): Result<PurchaseOrder, Error> =>
    maybePurchaseOrder.okOr(new Error(`Purchase order not found: ${id}`));

const ensureIsPending = (
  maybeDraft: PurchaseOrder
): ResultAsync<PendingPurchaseOrder, DomainInvariantViolation> =>
  PurchaseOrder.isPending(maybeDraft)
    ? OkAsync(maybeDraft)
    : ErrAsync(
        new DomainInvariantViolation(
          `Can't approve an order that isn't pending: ${maybeDraft.id}`
        )
      );

export const approvePO =
  ({ PORepo }: { PORepo: PurchaseOrderRepo }) =>
  (reviewer: Reviewer, id: Uuid): ResultAsync<null, Error> =>
    PORepo.fetch(id)
      .andThen(ensureExists(id))
      .andThen(ensureIsPending)
      .map(PurchaseOrder.approve(reviewer))
      .andThen(PORepo.save);
