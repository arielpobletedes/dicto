import { describe, expect, it } from "vitest";
import { DEFAULT_USER_ROLE, USER_ROLES, userRoleSchema } from "./roles";

describe("roles", () => {
  it("define los roles iniciales admin y student", () => {
    expect(USER_ROLES).toEqual(["admin", "student"]);
  });

  it("el rol por defecto es student", () => {
    expect(DEFAULT_USER_ROLE).toBe("student");
  });

  it("valida roles conocidos y rechaza desconocidos", () => {
    expect(userRoleSchema.safeParse("admin").success).toBe(true);
    expect(userRoleSchema.safeParse("superuser").success).toBe(false);
  });
});
