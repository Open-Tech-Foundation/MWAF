import { signal } from "@preact/signals"

export default function Reactivity(props) {
  const count = signal(0)
  return (
    <div title={props.title}>
      <span>{count.value}</span>
      <button onclick={() => count.value++}>Add</button>
    </div>
  )
}
