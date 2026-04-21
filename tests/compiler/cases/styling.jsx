export default function StylingTest(props) {
  const active = $state(true)
  
  return (
    <div class="static-class" className="static-classname">
      <span class={active ? "active" : "inactive"}>
        Reactive Class
      </span>
      <button className={props.theme}>
        Reactive ClassName from Props
      </button>
    </div>
  )
}
