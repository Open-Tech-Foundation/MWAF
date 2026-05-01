import { set } from "@opentf/std";

/**
 * A Zod resolver for web-forms.
 */
export function zodResolver(schema) {
  return (values) => {
    const result = schema.safeParse(values);
    
    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors = {};
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      set(errors, path, issue.message);
    });

    return { values: {}, errors };
  };
}
