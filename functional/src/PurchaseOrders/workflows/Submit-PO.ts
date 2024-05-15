import {
  errAsync as ErrAsync,
  okAsync as OkAsync,
  Result,
  ResultAsync,
} from "neverthrow";

import { DomainInvariantViolation } from "../../utilities/error/DomainInvariantViolation";
import { Option } from "../../utilities/option";
import { Uuid } from "../../utilities/uuid";
import { DraftPurchaseOrder, PurchaseOrder } from "../domain/PurchaseOrder";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";

const ensureExists =
  (id: Uuid) =>
  (maybePurchaseOrder: Option<PurchaseOrder>): Result<PurchaseOrder, Error> =>
    maybePurchaseOrder.okOr(new Error(`Purchase order not found: ${id}`));

const ensureIsDraft = (
  maybeDraft: PurchaseOrder
): ResultAsync<DraftPurchaseOrder, DomainInvariantViolation> =>
  PurchaseOrder.isDraft(maybeDraft)
    ? OkAsync(maybeDraft)
    : ErrAsync(
        new DomainInvariantViolation(
          `Can't submit an order that's already been submitted: ${maybeDraft.id}`
        )
      );

const pairNextPoNumber =
  (PORepo: PurchaseOrderRepo) => (po: DraftPurchaseOrder) =>
    ResultAsync.combine([OkAsync(po), PORepo.nextPoNumber(po.purchaser.org)]);

const applyTo =
  <F extends (...args: any[]) => unknown>(fn: F) =>
  (args: Parameters<F>) =>
    fn(...args) as ReturnType<F>;

export const submitPO =
  ({ PORepo }: { PORepo: PurchaseOrderRepo }) =>
  (id: Uuid): ResultAsync<null, Error> =>
    PORepo.fetch(id)
      .andThen(ensureExists(id))
      .andThen(ensureIsDraft)
      .andThen(pairNextPoNumber(PORepo))
      .map(applyTo(PurchaseOrder.submit))
      .andThen(PORepo.save);
