export default function RootLayout(props) {
  return (
    <div className="root-layout">
      <nav>
        <a href="/">Home</a>
      </nav>
      <main>
        {props.children}
      </main>
    </div>
  );
}
