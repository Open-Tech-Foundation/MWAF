
export default function SSGLayout({ children }) {
  return (
    <div id="layout-root">
      <header>Global Header</header>
      <main id="slot">
        {children}
      </main>
      <footer>Global Footer</footer>
    </div>
  );
}
