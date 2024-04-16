import { isUuid } from "../../utilities/uuid";
import { LineItem } from "./LineItem";
import { createPurchaseOrder } from "./PurchaseOrder";

describe("Purcase Order Entity", () => {
  it("generates its own UUID", () => {
    const PO = createPurchaseOrder();
    expect(isUuid(PO.id)).toBeTruthy();
  });

  it("has an empty list of line items by default", () => {
    const PO = createPurchaseOrder();
    expect(PO.lineItems).toEqual([]);
  });

  it.skip("includes all the line items it was created with", () => {
    const lineItems: LineItem[] = [
      /* ... */
    ];
    //const PO = createPurchaseOrder({ lineItems });
    //expect(PO.lineItems).toEqual(lineItems);
  });
});
