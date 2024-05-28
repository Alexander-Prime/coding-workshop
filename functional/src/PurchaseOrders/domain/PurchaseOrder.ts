import { err as Err, ok as Ok } from "neverthrow";
import { P, match } from "ts-pattern";

import { None, Option, Some } from "../../utilities/option";

import { NonEmptyArray } from "../../utilities/NonEmptyArray";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "./LineItem";
import { PurchaseOrderNumber } from "./PurchaseOrderNumber";
import { Purchaser } from "./Purchaser";
import { Reviewer } from "./Reviewer";

export type PurchaseOrder = {
  id: Uuid;
  poNumber: Option<PurchaseOrderNumber>;
  lineItems: NonEmptyArray<LineItem>;
  isSubmitted: boolean;
  purchaser: Purchaser;
  reviewedBy: Option<Reviewer>;
};

export type DraftPurchaseOrder = PurchaseOrder & {
  poNumber: None;
  isSubmitted: false;
};

export type PendingPurchaseOrder = PurchaseOrder & {
  poNumber: Some<PurchaseOrderNumber>;
  isSubmitted: true;
};

export type ApprovedPurchaseOrder = PurchaseOrder & {
  poNumber: Some<PurchaseOrderNumber>;
  isSubmitted: true;
  reviewedBy: Some<Reviewer>;
};

export const PurchaseOrder = {
  new: (
    purchaser: Purchaser,
    lineItems: NonEmptyArray<LineItem>
  ): PurchaseOrder => ({
    id: Uuid.v4(),
    poNumber: None,
    lineItems,
    isSubmitted: false,
    purchaser,
    reviewedBy: None,
  }),

  parse: (s: unknown) => (PurchaseOrder.check(s) ? Ok(s) : Err(new Error())),

  check: (s: unknown): s is PurchaseOrder =>
    match(s)
      .with({ id: P.when(Uuid.check), lineItems: P.array() }, () => true)
      .otherwise(() => false),

  isDraft: (po: PurchaseOrder): po is DraftPurchaseOrder =>
    po.poNumber.isNone() && !po.isSubmitted,

  submit: (
    po: DraftPurchaseOrder,
    poNumber: PurchaseOrderNumber
  ): PendingPurchaseOrder => ({
    ...po,
    poNumber: Some(poNumber),
    isSubmitted: true,
  }),

  approve: (
    po: PendingPurchaseOrder,
    reviewer: Reviewer
  ): ApprovedPurchaseOrder => ({
    ...po,
    reviewedBy: Some(reviewer),
  }),
};
