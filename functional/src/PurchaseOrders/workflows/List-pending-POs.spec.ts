import { ResultAsync } from "neverthrow";
import * as R from "remeda";

import { LineItem } from "../domain/LineItem";
import { MemoryPurchaseOrderDb } from "../domain/MemoryPurchaseOrderDb";
import { MemoryPurchaseOrderRepo } from "../domain/MemoryPurchaseOrderRepo";
import { PurchaseOrderRepo } from "../domain/PurchaseOrderRepo";
import { Purchaser } from "../domain/Purchaser";
import { createPO } from "./Create-PO";
import { listPendingPos } from "./List-pending-POs";
import { submitPO } from "./Submit-PO";

const generatePurchaseOrders = async (
  PORepo: PurchaseOrderRepo,
  count: number
) => {
  const purchaser = Purchaser.new({ namespace: "syn" });
  const ids = (
    await ResultAsync.combine(
      R.times(count, () => createPO({ PORepo })(purchaser, [LineItem.mock()]))
    )
  )._unsafeUnwrap();
  return ids;
};

describe("List pending POs workflow", () => {
  it("includes all POs in pending status", async () => {
    const db = MemoryPurchaseOrderDb.new();
    const PORepo = MemoryPurchaseOrderRepo.new(db);
    const ids = await generatePurchaseOrders(PORepo, 5);

    await ResultAsync.combine(ids.map(submitPO({ PORepo })));

    const results = (await listPendingPos({ PORepo })())._unsafeUnwrap();

    expect(results).toHaveLength(5);
  });

  it("excludes POs in draft status", async () => {
    const db = MemoryPurchaseOrderDb.new();
    const PORepo = MemoryPurchaseOrderRepo.new(db);
    const ids = await generatePurchaseOrders(PORepo, 5);

    await ResultAsync.combine(
      R.pipe(ids, R.take(4), R.map(submitPO({ PORepo })))
    );

    const results = (await listPendingPos({ PORepo })())._unsafeUnwrap();

    expect(results).toHaveLength(4);
  });

  it.skip("excludes POs in approved status", async () => {
    const db = MemoryPurchaseOrderDb.new();
    const PORepo = MemoryPurchaseOrderRepo.new(db);
    const ids = await generatePurchaseOrders(PORepo, 5);

    await ResultAsync.combine(ids.map(submitPO({ PORepo })));

    //await approvePO({ PORepo })([ids[0]]);

    const results = (await listPendingPos({ PORepo })())._unsafeUnwrap();

    expect(results).toHaveLength(4);
  });
});
