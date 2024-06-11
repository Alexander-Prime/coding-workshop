import { ok as Ok, ResultAsync } from "neverthrow";
import * as R from "remeda";

import { Uuid } from "../../utilities/uuid";
import { LineItem } from "../domain/LineItem";
import { MemoryPurchaseOrderDb } from "../domain/MemoryPurchaseOrderDb";
import { MemoryPurchaseOrderRepo } from "../domain/MemoryPurchaseOrderRepo";
import { Purchaser } from "../domain/Purchaser";
import { createPO } from "./Create-PO";
import { submitPO } from "./Submit-PO";

describe("Submit PO workflow", () => {
  it("assigns purchase order numbers sequentially", async () => {
    const db = MemoryPurchaseOrderDb.new();
    const PORepo = MemoryPurchaseOrderRepo.new(db);

    const purchaser = Purchaser.new({ namespace: "syn" });

    const ids = R.reverse(
      await ResultAsync.combine([
        createPO({ PORepo })(purchaser, [LineItem.mock()]),
        createPO({ PORepo })(purchaser, [LineItem.mock()]),
        createPO({ PORepo })(purchaser, [LineItem.mock()]),
        createPO({ PORepo })(purchaser, [LineItem.mock()]),
        createPO({ PORepo })(purchaser, [LineItem.mock()]),
      ]).unwrapOr([] as Uuid[])
    );

    await ResultAsync.combine(ids.map(submitPO({ PORepo })));

    const results = (
      await ResultAsync.combine(ids.map(PORepo.fetch))
    )._unsafeUnwrap();

    expect(results.map((r) => r.unwrap().poNumber.unwrap())).toEqual([
      "syn-000001",
      "syn-000002",
      "syn-000003",
      "syn-000004",
      "syn-000005",
    ]);
  });

  it("fails if the purchase order has already been submitted", async () => {
    const db = MemoryPurchaseOrderDb.new();
    const PORepo = MemoryPurchaseOrderRepo.new(db);
    const purchaser = Purchaser.new({ namespace: "syn" });

    const id = (
      await createPO({ PORepo })(purchaser, [LineItem.mock()])
    )._unsafeUnwrap();

    const firstResult = await submitPO({ PORepo })(id);
    const secondResult = await submitPO({ PORepo })(id);

    expect(firstResult).toEqual(Ok(null));
    expect(() => secondResult._unsafeUnwrap()).toThrow();
  });
});
