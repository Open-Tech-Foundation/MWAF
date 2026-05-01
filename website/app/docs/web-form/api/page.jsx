import CodeBlock from "../../../components/CodeBlock.jsx";

export default function WebFormApiDocs() {
  const schemaUsage = `const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
});

const form = createForm({
  initialValues: { email: "", age: 0 },
  validator: zodResolver(schema),
  mode: "onBlur"
});`;

  const resetUsage = `// Reset to initial values
form.reset();

// Reset to new values
form.reset({
  email: "new@example.com",
  age: 25
});`;

  return (
    <div className="space-y-16 pb-24">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)]">Web Form API Reference</h1>
        <p className="text-xl text-[var(--text-muted)] max-w-3xl">
          Detailed documentation for the <code className="text-accent">createForm</code> hook and the reactive form object it returns.
        </p>
      </section>

      <section id="create-form" className="space-y-8 scroll-mt-24">
        <h2 className="text-2xl font-bold border-b border-[var(--border)] pb-2 text-[var(--text-main)]">createForm(options)</h2>
        <div className="space-y-6">
          <p className="text-[var(--text-muted)]">
            The primary hook for initializing form state. It should be called at the top level of your component.
          </p>
          
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)]/30">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--bg-surface)] text-[var(--text-main)] font-bold border-b border-[var(--border)]">
                <tr>
                  <th className="px-6 py-4">Option</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Default</th>
                  <th className="px-6 py-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)] text-[var(--text-muted)]">
                <tr>
                  <td className="px-6 py-4 font-mono text-accent">initialValues</td>
                  <td className="px-6 py-4">Object</td>
                  <td className="px-6 py-4 font-mono">{"{}"}</td>
                  <td className="px-6 py-4">The starting state of the form.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono text-accent">validator</td>
                  <td className="px-6 py-4">Function</td>
                  <td className="px-6 py-4 font-mono">undefined</td>
                  <td className="px-6 py-4">A validation function or resolver (e.g., Zod).</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono text-accent">mode</td>
                  <td className="px-6 py-4">String</td>
                  <td className="px-6 py-4 font-mono">"onBlur"</td>
                  <td className="px-6 py-4">Validation strategy: <code className="text-xs">onBlur</code>, <code className="text-xs">onChange</code>, <code className="text-xs">onSubmit</code>.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-mono text-accent">reValidateMode</td>
                  <td className="px-6 py-4">String</td>
                  <td className="px-6 py-4 font-mono">"onChange"</td>
                  <td className="px-6 py-4">Validation strategy after an error: <code className="text-xs">onChange</code>, <code className="text-xs">onBlur</code>, <code className="text-xs">onSubmit</code>.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="form-object" className="space-y-12 scroll-mt-24">
        <h2 className="text-2xl font-bold border-b border-[var(--border)] pb-2 text-[var(--text-main)]">Form Object</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-xs">Reactive State</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <code className="text-accent font-bold block mb-1">form.values</code>
                <p className="text-xs text-[var(--text-muted)]">A deep reactive proxy of the current form values.</p>
              </div>
              <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <code className="text-accent font-bold block mb-1">form.errors</code>
                <p className="text-xs text-[var(--text-muted)]">Object containing validation messages indexed by field path.</p>
              </div>
              <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <code className="text-accent font-bold block mb-1">form.touched</code>
                <p className="text-xs text-[var(--text-muted)]">Tracks which fields have been interacted with.</p>
              </div>
              <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <code className="text-accent font-bold block mb-1">form.isValid</code>
                <p className="text-xs text-[var(--text-muted)]">Boolean signal that is true when there are no errors.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-[var(--text-main)] uppercase tracking-wider text-xs">Methods</h3>
            <div className="space-y-4">
              <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <code className="text-accent font-bold block mb-1">form.register(path)</code>
                <p className="text-xs text-[var(--text-muted)]">Returns props (<code className="text-xs">name, value, oninput, onblur</code>) for input binding.</p>
              </div>
              <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <code className="text-accent font-bold block mb-1">form.handleSubmit(fn)</code>
                <p className="text-xs text-[var(--text-muted)]">Wraps your submit handler. Handles event prevention and marks all as touched.</p>
              </div>
              <div className="p-4 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
                <code className="text-accent font-bold block mb-1">form.reset(values?)</code>
                <p className="text-xs text-[var(--text-muted)]">Resets form state. Optionally accepts new initial values.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="usage-examples" className="space-y-8 scroll-mt-24">
        <h2 className="text-2xl font-bold border-b border-[var(--border)] pb-2 text-[var(--text-main)]">Advanced Usage</h2>
        
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[var(--text-main)]">Custom Validation Resolver</h3>
          <p className="text-[var(--text-muted)]">
            You can use any validation library by providing a resolver function that returns <code className="text-xs">{`{ values, errors }`}</code>.
          </p>
          <CodeBlock code={schemaUsage} />
        </div>

        <div className="space-y-6 pt-8">
          <h3 className="text-lg font-bold text-[var(--text-main)]">Manual Reset & Hydration</h3>
          <p className="text-[var(--text-muted)]">
            Reset the form after successful submission or hydrate it with data from an API.
          </p>
          <CodeBlock code={resetUsage} />
        </div>
      </section>
    </div>
  );
}
