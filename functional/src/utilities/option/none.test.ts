import { isMatching } from "ts-pattern";

import { None } from "./none";

describe("None", () => {
  it("matches itself", () => {
    expect(isMatching(None, None)).toBeTruthy();
  });
});
