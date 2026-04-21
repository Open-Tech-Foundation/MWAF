export default function NestedReactivity(props) {
  const show = $state(true);
  return (
    <div>
      {show && <span title={props.title}>Hello</span>}
    </div>
  );
}
