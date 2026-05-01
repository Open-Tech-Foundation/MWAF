import CodeBlock from "../../components/CodeBlock.jsx";
import Tabs from "../../components/Tabs.jsx";
import { BasicForm, ComplexForm } from "./FormComponents.jsx";

export default function WebFormDocs() {
  const basicUsage = `import { createForm } from "@opentf/web-form";

export function LoginForm() {
  const form = createForm({
    initialValues: { email: "", password: "" }
  });

  const onSubmit = (values) => console.log(values);

  return (
    <form onsubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register("email")} />
      <input {...form.register("password")} type="password" />
      <button type="submit">Login</button>
    </form>
  );
}`;

  const validationUsage = `const schema = z.object({
  email: z.string().email(),
  age: z.number().min(18)
});

const form = createForm({
  initialValues: { email: "", age: 0 },
  validator: zodResolver(schema),
  mode: "onBlur"
});`;

  const nestingUsage = `// Registering nested paths
<input {...form.register("profile.firstName")} />
<input {...form.register("settings.notifications.email")} />

// Accessing nested errors
{form.errors.profile?.firstName && <span>{form.errors.profile.firstName}</span>}`;

  const activeDemoTab = $state("basic");

  return (
    <div className="space-y-24 pb-24">
      {/* HEADER */}
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-[var(--text-main)]">Form State Management</h1>
        <p className="text-xl text-[var(--text-muted)] max-w-3xl">
          High-performance, signal-based form handling for the native-first web. 
          Manage complex nested state, validation, and submission with zero boilerplate.
        </p>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="demo" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[var(--text-main)]">Live Demo</h2>
          <nav className="flex p-1 bg-[var(--bg-surface)] rounded-xl border border-[var(--border)]">
            <button 
              onclick={() => activeDemoTab = "basic"}
              className={activeDemoTab === "basic" 
                ? "px-4 py-1.5 rounded-lg bg-[var(--bg-main)] text-[var(--text-main)] text-sm font-bold shadow-sm border border-[var(--border)]/50 transition-all"
                : "px-4 py-1.5 rounded-lg text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text-main)] transition-all"
              }
            >
              Basic
            </button>
            <button 
              onclick={() => activeDemoTab = "complex"}
              className={activeDemoTab === "complex" 
                ? "px-4 py-1.5 rounded-lg bg-[var(--bg-main)] text-[var(--text-main)] text-sm font-bold shadow-sm border border-[var(--border)]/50 transition-all"
                : "px-4 py-1.5 rounded-lg text-[var(--text-muted)] text-sm font-medium hover:text-[var(--text-main)] transition-all"
              }
            >
              Advanced
            </button>
          </nav>
        </div>

        <div className="p-1 min-h-[500px]">
          {activeDemoTab === "basic" ? <BasicForm /> : <ComplexForm />}
        </div>
      </section>

      {/* CORE CONCEPTS */}
      <section className="space-y-12">
        <div id="getting-started" className="space-y-4 scroll-mt-24 group">
          <h2 className="text-2xl font-bold border-b border-[var(--border)] pb-2 flex items-center gap-2">
            Getting Started
            <a href="#getting-started" className="opacity-0 group-hover:opacity-100 text-accent text-sm transition-opacity">#</a>
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            The <code className="text-accent">createForm</code> hook is the entry point for form management. 
            It returns a stable form object containing reactive signals for values, errors, and lifecycle state.
          </p>
          <CodeBlock code={basicUsage} />
        </div>

        <div id="validation-modes" className="space-y-4 scroll-mt-24 group">
          <h2 className="text-2xl font-bold border-b border-[var(--border)] pb-2 flex items-center gap-2">
            Validation Strategies
            <a href="#validation-modes" className="opacity-0 group-hover:opacity-100 text-accent text-sm transition-opacity">#</a>
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Choose the strategy that best fits your user experience. You can configure both the initial validation and how the form re-validates after an error is caught.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="p-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
              <h4 className="font-bold text-[var(--text-main)] mb-2">onBlur (Default)</h4>
              <p className="text-xs text-[var(--text-muted)]">Validation triggers only when a user leaves the field. This is the least intrusive mode for new inputs.</p>
            </div>
            <div className="p-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
              <h4 className="font-bold text-[var(--text-main)] mb-2">onChange</h4>
              <p className="text-xs text-[var(--text-muted)]">Aggressive real-time validation. Every keystroke is validated immediately.</p>
            </div>
            <div className="p-4 bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)]">
              <h4 className="font-bold text-[var(--text-main)] mb-2">onSubmit</h4>
              <p className="text-xs text-[var(--text-muted)]">Validation only happens when the user attempts to submit the form.</p>
            </div>
          </div>
        </div>

        <div id="registration" className="space-y-4 scroll-mt-24 group">
          <h2 className="text-2xl font-bold border-b border-[var(--border)] pb-2 flex items-center gap-2">
            Input Registration
            <a href="#registration" className="opacity-0 group-hover:opacity-100 text-accent text-sm transition-opacity">#</a>
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            The <code className="text-accent">form.register(path)</code> method returns an object of props that bind an input to the form state. 
            It handles <code className="text-[var(--text-main)] font-mono">value</code>, <code className="text-[var(--text-main)] font-mono">oninput</code>, and <code className="text-[var(--text-main)] font-mono">onblur</code> automatically.
          </p>
          <div className="bg-[var(--accent-soft)] border-l-4 border-[var(--accent)] p-4 rounded-r-xl">
            <p className="text-sm text-[var(--text-main)] font-medium">
              <strong>Note:</strong> registration works seamlessly with standard HTML inputs and custom components that follow the <code className="text-[var(--text-main)]">value/oninput</code> pattern.
            </p>
          </div>
        </div>

        <div id="nested-data" className="space-y-4 scroll-mt-24 group">
          <h2 className="text-2xl font-bold border-b border-[var(--border)] pb-2 flex items-center gap-2">
            Nested Data Structures
            <a href="#nested-data" className="opacity-0 group-hover:opacity-100 text-accent text-sm transition-opacity">#</a>
          </h2>
          <p className="text-[var(--text-muted)] leading-relaxed">
            Web-form uses path-based strings to manage deeply nested objects and arrays. This allows for extremely efficient, fine-grained updates without cloning the entire state tree.
          </p>
          <CodeBlock code={nestingUsage} />
        </div>
      </section>

      {/* FOOTER */}
      <section className="pt-12 border-t border-[var(--border)] text-center">
        <p className="text-[var(--text-muted)] mb-6">Need the full list of methods and signals?</p>
        <a href="/docs/web-form/api" className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--text-main)] text-[var(--bg-main)] rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-95">
          View API Reference
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </a>
      </section>
    </div>
  );
}
