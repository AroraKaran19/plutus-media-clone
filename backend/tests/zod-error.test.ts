import { describe, expect, it } from "vitest";
import { z } from "zod";
import { formatZodError } from "../src/utils/zod-error";

const schema = z.object({
  title: z.string().min(1),
  logos: z.array(z.object({ name: z.string().min(1) })).max(2),
});

const failureFor = (payload: unknown) => {
  const result = schema.safeParse(payload);
  if (result.success) throw new Error("Expected the payload to fail validation");
  return formatZodError(result.error);
};

describe("formatZodError", () => {
  it("names array rows 1-based, the way an editor sees them", () => {
    const { issues } = failureFor({ title: "T", logos: [{ name: "a" }, { name: "" }] });
    expect(issues[0].label).toBe("Logo 2 → Name");
    expect(issues[0].message).toBe("Cannot be empty");
  });

  it("summarizes a single failure as the failure itself", () => {
    const { message } = failureFor({ title: "", logos: [] });
    expect(message).toBe("Title: Cannot be empty");
  });

  it("summarizes several failures by count", () => {
    const { message } = failureFor({ title: "", logos: [{ name: "" }] });
    expect(message).toBe("2 fields need attention");
  });

  it("explains an array cap in plain words", () => {
    const { issues } = failureFor({ title: "T", logos: Array(3).fill({ name: "a" }) });
    expect(issues[0].message).toBe("At most 2 allowed");
  });
});
