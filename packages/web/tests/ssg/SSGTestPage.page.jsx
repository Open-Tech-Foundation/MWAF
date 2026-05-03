
export default function SSGTestPage({ params }) {
  let count = $state(0);
  
  return (
    <div className="ssg-container">
      <h1 id="title">SSG Test</h1>
      <p id="msg">Hello {params.name}</p>
      <div id="dynamic-content">
        {count === 0 ? <span id="initial">Initial</span> : <span id="updated">Updated</span>}
      </div>
      <ul id="list">
        {[1, 2, 3].map(i => (
          <li className="item">{i}</li>
        ))}
      </ul>
    </div>
  );
}
