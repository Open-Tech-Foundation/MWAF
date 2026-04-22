/**
 * A Zod resolver for mwaf-forms.
 * Converts Zod validation errors into a flat object of field paths and error messages.
 * This is a demo-specific utility and is not part of the core MWAF library.
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
      if (!errors[path]) {
        errors[path] = issue.message;
      }
    });

    return { values: {}, errors };
  };
}
