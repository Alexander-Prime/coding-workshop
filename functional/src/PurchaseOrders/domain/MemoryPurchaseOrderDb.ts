import { PurchaseOrder } from "./PurchaseOrder";

export type MemoryPurchaseOrderDb = {
  purchaseOrders: PurchaseOrder[];
};

export const MemoryPurchaseOrderDb = {
  new: (
    overrides: Partial<MemoryPurchaseOrderDb> = {}
  ): MemoryPurchaseOrderDb => ({
    purchaseOrders: [],
    ...overrides,
  }),
};
