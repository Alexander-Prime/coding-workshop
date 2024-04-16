import { NonEmptyArray } from "../../utilities/NonEmptyArray";
import { UUID, createUuid, isUuid } from "../../utilities/uuid";
import { LineItem } from "./LineItem";

export type PurchaseOrder = { id: UUID; lineItems: NonEmptyArray<LineItem> };
export type createPurchaseOrder = (
  lineItems: NonEmptyArray<LineItem>
) => PurchaseOrder;

export const createPurchaseOrder: createPurchaseOrder = (lineItems) => ({
  id: createUuid(),
  lineItems,
});
export const isPurchaseOrder = (s: any): s is PurchaseOrder => {
  if (typeof s !== "object") return false;

  const po = s as PurchaseOrder;
  if (!po.id) return false;
  if (!isUuid(po.id)) return false;

  return true;
};
