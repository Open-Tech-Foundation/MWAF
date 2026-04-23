# @opentf/web-form

A reactive form management library for the **Web App Framework**.

## Features

- ✅ **Reactive Binding**: Seamlessly bind form values to signals.
- 🌲 **Nested State**: Support for complex, nested form structures.
- 🛡️ **Validation**: Flexible validation system with Zod or custom logic.
- 🚀 **High Performance**: Direct DOM updates without VDOM overhead.
- 🛠️ **Simple API**: Featuring a `register` pattern for clean boilerplate-free code.

## Installation

```bash
npm install @opentf/web-form
```

## Basic Usage

### Using the `register` Pattern

The `register` function returns all necessary props (`name`, `value`, `oninput`, `onblur`) to bind a field to an input element.

```jsx
import { createForm } from '@opentf/web-form';

const form = createForm({
  initialValues: { username: '' }
});

// In your component
<input {...form.register('username')} />
```

## Validation with Zod

You can easily integrate **Zod** for schema-based validation by providing a `validator` function.

```javascript
import { createForm } from '@opentf/web-form';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3, 'Too short'),
  email: z.string().email('Invalid email')
});

// A simple Zod validator wrapper
const zodValidator = (values, schema) => {
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors = {};
  result.error.errors.forEach(e => {
    errors[e.path.join('.')] = e.message;
  });
  return { errors };
};

const form = createForm({
  initialValues: { username: '', email: '' },
  schema,
  validator: zodValidator
});

const onSubmit = (values) => {
  console.log('Form Submitted:', values);
};

// In your component
<form onsubmit={form.handleSubmit(onSubmit)}>
  <div>
    <input {...form.register('username')} placeholder="Username" />
    <span className="error">{form.errors.value.username}</span>
  </div>
  
  <div>
    <input {...form.register('email')} placeholder="Email" />
    <span className="error">{form.errors.value.email}</span>
  </div>

  <button type="submit">Submit</button>
</form>
```

## License

MIT © [Open Tech Foundation](https://github.com/Open-Tech-Foundation)
