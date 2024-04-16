export type LineItem = {
  itemNumber: unknown;
  description: string;
  price: number;
  quantity: number;
};

export const LineItem = {
  new: (params: LineItem) => params,

  mock: (params: Partial<LineItem> = {}) =>
    LineItem.new({
      itemNumber: 0,
      description: "Test line item",
      price: 10,
      quantity: 1,
      ...params,
    }),
};
