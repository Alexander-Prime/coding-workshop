import { LineItem } from "./LineItem";

describe("LineItem.new()", () => {
  it("returns the passed line item unchanged", () => {
    const itemParams = {
      itemNumber: 999,
      description: "A line item description",
      price: 55,
      quantity: 10,
    };
    const lineItem = LineItem.new(itemParams);
    expect(lineItem).toEqual(itemParams);
  });
});

describe("LineItem.mock()", () => {
  it("fills omitted properties with default values", () => {
    const lineItem = LineItem.mock({});
    expect(lineItem.itemNumber).not.toBeUndefined();
    expect(lineItem.description).not.toBeUndefined();
    expect(lineItem.price).not.toBeUndefined();
    expect(lineItem.quantity).not.toBeUndefined();
  });
});
