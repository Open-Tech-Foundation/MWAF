import { expect, test, describe } from "bun:test";
import { createForm } from "../../packages/web-form/index.js";

describe("Web App Framework Forms Library", () => {
  test("initializes with flat values", () => {
    const form = createForm({
      initialValues: { username: "alice", email: "alice@example.com" }
    });
    
    expect(form.values.username).toBe("alice");
    expect(form.values.email).toBe("alice@example.com");
  });

  test("initializes with nested values", () => {
    const form = createForm({
      initialValues: {
        profile: { firstName: "John", lastName: "Doe" }
      }
    });
    
    expect(form.values.profile.firstName).toBe("John");
    expect(form.values.profile.lastName).toBe("Doe");
  });

  test("initializes with array values", () => {
    const form = createForm({
      initialValues: {
        skills: ["JS", "Web App Framework"]
      }
    });
    
    expect(Array.isArray(form.values.skills)).toBe(true);
    expect(form.values.skills[0]).toBe("JS");
    expect(form.values.skills[1]).toBe("Web App Framework");
  });

  test("updates values reactively", () => {
    const form = createForm({
      initialValues: { username: "alice" }
    });
    
    const reg = form.register("username");
    reg.oninput({ target: { value: "bob", type: "text" } });
    
    expect(form.values.username).toBe("bob");
  });

  test("supports direct assignment to values proxy", () => {
    const form = createForm({
      initialValues: { username: "alice" }
    });
    
    form.values.username = "bob";
    expect(form.values.username).toBe("bob");
    
    form.values.profile = { firstName: "Charlie" };
    expect(form.values.profile.firstName).toBe("Charlie");
  });

  test("validates values", () => {
    const form = createForm({
      initialValues: { username: "" },
      validate: (v) => {
        const errs = {};
        if (!v.username) errs.username = "Required";
        return errs;
      }
    });
    
    expect(form.errors.value.username).toBe("Required");
    
    const reg = form.register("username");
    reg.oninput({ target: { value: "bob", type: "text" } });
    
    expect(form.errors.value.username).toBeUndefined();
  });
});
