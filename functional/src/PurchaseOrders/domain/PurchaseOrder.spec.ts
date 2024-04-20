import { ok as Ok } from "neverthrow";
import * as R from "remeda";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "./LineItem";
import { PurchaseOrder } from "./PurchaseOrder";

describe("Purcase Order Entity", () => {
  it("generates its own UUID", () => {
    const PO = PurchaseOrder.new([LineItem.mock()]);
    expect(Uuid.parse(PO.id)).toEqual(Ok(PO.id));
  });

  it("includes all the line items it was created with", () => {
    {
      const oneLineItem = [LineItem.mock()] as const;
      const PO = PurchaseOrder.new(oneLineItem);
      expect(PO.lineItems).toEqual(oneLineItem);
    }

    {
      const tenLineItems = [
        LineItem.mock({ itemNumber: 0 }),
        ...R.times(9, (n) => LineItem.mock({ itemNumber: n + 1 })),
      ] as const;
      const PO = PurchaseOrder.new(tenLineItems);
      expect(PO.lineItems).toEqual(tenLineItems);
    }
  });
});
