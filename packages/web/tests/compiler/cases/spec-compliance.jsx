
// Section 2.7, 2.10: Destructured Props with Defaults and Aliases
export function PropPatterns({ name = "Guest", age: years = 25, ...others }) {
  return (
    <div>
      <p>Name: {name}</p>
      <p>Age: {years}</p>
      <p>Other: {others.role}</p>
    </div>
  );
}

// Section 5.3.1: Event Normalization (Native vs Component)
export function EventPatterns() {
  const handleNative = () => console.log("native");
  const handleComp = () => console.log("comp");
  return (
    <div onClick={handleNative}>
       <PropPatterns onCustomEvent={handleComp} onClick={handleComp} />
    </div>
  );
}

// Section 5.2.1, 5.2.3: Special Attributes
export function AttrPatterns() {
  let isTrue = true;
  let isNull = null;
  return (
    <div 
      tabIndex={0} 
      disabled={isTrue} 
      hidden={false}
      aria-label="test"
      data-id={123}
      title={isNull}
    >
      Content
    </div>
  );
}

// Section 5.4.1: HTML Entities
export function TextPatterns() {
  return (
    <div>
      &copy; 2024 WAF &amp; Co.
      <br />
      Void element test: <input />
    </div>
  );
}

// Section 3.2, 4.6: Macros ($derived expressions, $expose)
export function MacroPatterns() {
  let a = $state(10);
  let b = $state(20);
  // Auto-wrapping expression in computed
  let sum = $derived(a + b);
  
  $expose({ 
    getSum: () => sum
  });

  return <div>Sum: {sum}</div>;
}

// Section 3.5: $signal() First-Access Rule
export function SignalPatterns() {
  const store = $signal({ user: { name: "Alice" }, count: 0 });
  const { count } = $signal({ count: 100 });
  
  return (
    <div>
      <p>User: {store.user.name}</p>
      <p>Count: {count}</p>
    </div>
  );
}
