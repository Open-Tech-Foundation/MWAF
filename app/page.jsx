import Counter from "../components/Counter.wc.jsx"

export default function Page() {
  return (
    <div>
      <h1>WAF Framework</h1>
      <p>Using the new .wc.jsx convention</p>
      <Counter label="Increment 1" />
      <Counter label="Increment 2" />
      <hr />
      <a href="/about" onclick={(e) => {
        e.preventDefault()
        import("../framework/router/index").then(m => m.navigate("/about", document.getElementById("app")))
      }}>Go to About</a>
    </div>
  )
}
