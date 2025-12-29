import { describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, mergeConfig } from "../src/config";

describe("config.mergeConfig", () => {
  it("applies precedence defaults < file < env < cli", () => {
    const merged = mergeConfig({
      defaults: DEFAULT_CONFIG,
      fileConfig: { folder: "From File", account: "File Account" },
      envConfig: { folder: "From Env" },
      cliConfig: { folder: "From CLI", account: "CLI Account" },
    });

    expect(merged).toEqual({ folder: "From CLI", account: "CLI Account" });
  });

  it("throws when folder is empty", () => {
    expect(() =>
      mergeConfig({
        defaults: DEFAULT_CONFIG,
        fileConfig: {},
        envConfig: { folder: "   " },
        cliConfig: {},
      }),
    ).toThrow(/folder must be a non-empty string/i);
  });
});
