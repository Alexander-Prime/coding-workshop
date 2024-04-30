import { err as Err, ok as Ok } from "neverthrow";

import { PurchaseOrderNumber } from "./PurchaseOrderNumber";

describe("PurchaseOrderNumber.parse()", () => {
  it("accepts purchase order numbers of the form `<pfx>-######`", () => {
    const idString = "syn-000001";
    expect(PurchaseOrderNumber.parse(idString)).toEqual(Ok(idString));
  });

  it("rejects purchase order numbers that are too short", () => {
    expect(PurchaseOrderNumber.parse("syn-01")).toEqual(Err(expect.anything()));
  });

  it("rejects purchase order numbers that are missing a prefix", () => {
    expect(PurchaseOrderNumber.parse("000001")).toEqual(Err(expect.anything()));
  });
});

describe("PurchaseOrderNumber.check()", () => {
  it("accepts purchase order numbers of the form `<pfx>-######`", () => {
    expect(PurchaseOrderNumber.check("syn-000001")).toBeTruthy();
  });

  it("rejects purchase order numbers that are too short", () => {
    expect(PurchaseOrderNumber.check("syn-01")).toBeFalsy();
  });

  it("rejects purchase order numbers that are missing a prefix", () => {
    expect(PurchaseOrderNumber.check("000001")).toBeFalsy();
  });

  it("rejects a null input", () => {
    expect(PurchaseOrderNumber.check(null)).toBeFalsy();
  });

  it("rejects an object input", () => {
    expect(PurchaseOrderNumber.check({})).toBeFalsy();
  });
});

describe("PurchaseOrderNumber.prefix()", () => {
  it("returns the prefix encoded in the purchase order number (`<pfx>-######`)", () => {
    const num = PurchaseOrderNumber.parse("syn-000001")._unsafeUnwrap();
    expect(PurchaseOrderNumber.prefix(num)).toEqual("syn");
  });
});

describe("PurchaseOrderNumber.number()", () => {
  it("returns the numeric part of the purchase order number (`<pfx>-######`)", () => {
    const num = PurchaseOrderNumber.parse("syn-000001")._unsafeUnwrap();
    expect(PurchaseOrderNumber.value(num)).toEqual(1);
  });
});
