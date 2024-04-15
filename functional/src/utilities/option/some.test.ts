import { isMatching } from "ts-pattern";

import { Some } from "./some";

describe("Some<T>", () => {
  it("matches Some with the same contents", () => {
    expect(isMatching(Some(0), Some(0))).toBeTruthy();
  });

  it("doesn't match Some with different contents", () => {
    expect(!isMatching(Some(0), Some(1))).toBeTruthy();
  });
});
