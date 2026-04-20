export default function WhitespaceTest() {
  const name = "WAF"
  return (
    <div>
      <span>Hello {name}!</span>
      <p>
        Line 1
        Line 2
      </p>
      <div>Spaces should be preserved here -> </div>
    </div>
  )
}
