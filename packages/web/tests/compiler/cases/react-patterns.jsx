import { UI } from './ui-lib';

export default function ReactPatterns(props) {
  const Tag = props.isHeader ? 'h1' : 'h2';
  const items = ['A', 'B'];

  return (
    <div className="container" data-testid="main-div">
      {/* 1. Boolean & Numeric Props */}
      <input disabled tabIndex={-1} maxLength={5} />

      {/* 2. Dynamic Tag Names */}
      <Tag>Dynamic Heading</Tag>

      {/* 3. Member Expressions */}
      <UI.Button variant="primary">Click Me</UI.Button>

      {/* 4. Mixed Content with Expressions */}
      <p>
        Welcome, <strong>{props.user.name}</strong>! 
        You have {props.notifications.length} new messages.
      </p>

      {/* 5. Spread with overrides */}
      <div {...props.extra} className="override" id="constant">
        Spread Test
      </div>

      {/* 6. Array as children */}
      <ul>
        {[
          <li key="1">One</li>,
          <li key="2">Two</li>
        ]}
      </ul>

      {/* 7. Render Props (Children as function) */}
      <DataProvider>
        {(data) => <div>Data: {data.value}</div>}
      </DataProvider>

      {/* 8. SVG with camelCase and namespaces */}
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" strokeWidth="2" fill="red" />
      </svg>

      {/* 9. Self-closing components vs tags */}
      <CustomComponent />
      <br />
      <hr />
    </div>
  );
}

function DataProvider({ children }) {
  const data = { value: 'Secret' };
  return typeof children === 'function' ? children(data) : children;
}

function CustomComponent() {
  return <div>Custom</div>;
}
