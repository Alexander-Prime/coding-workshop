import { ok as Ok } from "neverthrow";
import * as R from "remeda";

import { Uuid } from "../../utilities/uuid";
import { LineItem } from "./LineItem";
import { PurchaseOrder } from "./PurchaseOrder";
import { Purchaser } from "./Purchaser";

describe("Purcase Order Entity", () => {
  it("generates its own UUID", () => {
    const purchaser = Purchaser.new({ namespace: "syn" });
    const PO = PurchaseOrder.new(purchaser, [LineItem.mock()]);
    expect(Uuid.parse(PO.id)).toEqual(Ok(PO.id));
  });

  it("includes all the line items it was created with", () => {
    const purchaser = Purchaser.new({ namespace: "syn" });

    {
      const oneLineItem = [LineItem.mock()] as const;
      const PO = PurchaseOrder.new(purchaser, oneLineItem);
      expect(PO.lineItems).toEqual(oneLineItem);
    }

    {
      const tenLineItems = [
        LineItem.mock({ itemNumber: 0 }),
        ...R.times(9, (n) => LineItem.mock({ itemNumber: n + 1 })),
      ] as const;
      const PO = PurchaseOrder.new(purchaser, tenLineItems);
      expect(PO.lineItems).toEqual(tenLineItems);
    }
  });
});
