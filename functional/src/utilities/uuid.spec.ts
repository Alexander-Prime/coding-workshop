import { err as Err, ok as Ok } from "neverthrow";
import { v4 } from "uuid";

import { Uuid } from "./uuid";

describe("Uuid.v4()", () => {
  it("Creates a new uuid", () => {
    const id = Uuid.v4();
    const v4 = new RegExp(
      /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
    );

    expect(id.match(v4)).toBeTruthy();
  });
});

describe("Uuid.parse()", () => {
  it("Creates a uuid successfully from a string", () => {
    const idString = "2465fdd7-e581-436f-98f3-516bd8d6fd02";
    expect(Uuid.parse(idString)).toEqual(Ok(idString));
  });

  it("Prevents invalid uuid creation", () => {
    const invalidIdString = "NOT A ID";
    expect(Uuid.parse(invalidIdString)).toEqual(Err(expect.anything()));
  });

  it("Prevents empty UUID creation", () => {
    expect(Uuid.parse("")).toEqual(Err(expect.anything()));
  });
});

describe("Uuid.check()", () => {
  it("succeeds when valid", () => {
    expect(Uuid.check(v4())).toBeTruthy();
  });

  it("fails when invalid string", () => {
    expect(Uuid.check("hello")).toBeFalsy();
  });

  it("fails when input is null", () => {
    expect(Uuid.check(null)).toBeFalsy();
  });

  it("fails when input is object", () => {
    expect(Uuid.check({})).toBeFalsy();
  });
});
