export default function WhitespaceEdgeCases() {
  return (
    <div>
      {/* Case 1: Intentional space in expression */}
      <p>Edit{" "}<span>app/page.jsx</span> to get started</p>

      {/* Case 2: Newline between words (should collapse to one space) */}
      <p>
        Hello
        World
      </p>

      {/* Case 3: Spaces between tags */}
      <div>
        <span>A</span> <span>B</span>
      </div>

      {/* Case 4: Newline between tags (should collapse to one space) */}
      <div>
        <span>C</span>
        <span>D</span>
      </div>

      {/* Case 5: Formatting-only whitespace (should be ignored) */}
      <ul>
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>

      {/* Case 6: Mixed text and expressions */}
      <p>
        Count is: {123} (approx)
      </p>

      {/* Case 7: Complex nesting with spaces */}
      <div>
        <strong>Bold</strong> <em>Italic</em> <u>Underline</u>
      </div>
    </div>
  );
}
