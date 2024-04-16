import { UUID, createUuid, isUuid } from "../../utilities/uuid";
import { LineItem } from "./LineItem";

export type PurchaseOrder = { id: UUID; lineItems: LineItem[] };
export type createPurchaseOrder = () => PurchaseOrder;

export const createPurchaseOrder: createPurchaseOrder = () => ({
  id: createUuid(),
  lineItems: [],
});
export const isPurchaseOrder = (s: any): s is PurchaseOrder => {
  if (typeof s !== "object") return false;

  const po = s as PurchaseOrder;
  if (!po.id) return false;
  if (!isUuid(po.id)) return false;

  return true;
};
