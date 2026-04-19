export default function AboutPage() {
  return (
    <div>
      <h1>About WAF</h1>
      <p>This framework is strictly structured.</p>
      <a href="/" onclick={(e) => {
        e.preventDefault()
        import("../../framework/router/index").then(m => m.navigate("/", document.getElementById("app")))
      }}>Go Back Home</a>
    </div>
  )
}
