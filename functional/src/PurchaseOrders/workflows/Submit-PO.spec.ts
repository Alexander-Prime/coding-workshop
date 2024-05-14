import { ok as Ok, ResultAsync } from "neverthrow";

import { reverse } from "remeda";
import { Uuid } from "../../utilities/uuid";
import { LineItem } from "../domain/LineItem";
import { MemoryPurchaseOrderRepo } from "../domain/MemoryPurchaseOrderRepo";
import { createPO } from "./Create-PO";
import { submitPO } from "./Submit-PO";

describe("Submit PO workflow", () => {
  it("assigns purchase order numbers sequentially", async () => {
    const PORepo = MemoryPurchaseOrderRepo.new();

    const ids = reverse(
      await ResultAsync.combine([
        createPO({ PORepo })("syn", [LineItem.mock()]),
        createPO({ PORepo })("syn", [LineItem.mock()]),
        createPO({ PORepo })("syn", [LineItem.mock()]),
        createPO({ PORepo })("syn", [LineItem.mock()]),
        createPO({ PORepo })("syn", [LineItem.mock()]),
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
    const PORepo = MemoryPurchaseOrderRepo.new();

    const id = (
      await createPO({ PORepo })("syn", [LineItem.mock()])
    )._unsafeUnwrap();

    const firstResult = await submitPO({ PORepo })(id);
    const secondResult = await submitPO({ PORepo })(id);

    expect(firstResult).toEqual(Ok(null));
    expect(() => secondResult._unsafeUnwrap()).toThrow();
  });
});
