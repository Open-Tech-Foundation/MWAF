import { expect, test, describe } from "bun:test";
import { createForm } from "../index.js";

describe("Web App Framework Forms Library - Pure Logic", () => {
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
        skills: ["JS", "Framework"]
      }
    });
    
    expect(form.values.skills[0]).toBe("JS");
    expect(form.values.skills[1]).toBe("Framework");
  });

  test("updates values reactively", () => {
    const form = createForm({
      initialValues: { count: 0 }
    });
    
    form.values.count = 1;
    expect(form.values.count).toBe(1);
  });

  test("supports direct assignment to values proxy", () => {
    const form = createForm({
      initialValues: { user: { name: "A" } }
    });
    
    form.values.user = { name: "B" };
    expect(form.values.user.name).toBe("B");
  });

  test("validates values", () => {
    const form = createForm({
      initialValues: { age: 10 },
      validator: (v) => {
        const errors = {};
        if (v.age < 18) errors.age = "Too young";
        return errors;
      }
    });
    
    expect(form.errors.age).toBe("Too young");
    form.values.age = 20;
    expect(form.errors.age).toBeUndefined();
  });
});
