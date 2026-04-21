import { navigate } from "./index"

export default function Link(props) {
  return (
    <a
      href={props.href}
      className={props.className || 'hover:text-blue-400'}
      style={props.style}
      onclick={(e) => {
        if (
          e.defaultPrevented ||
          e.metaKey ||
          e.ctrlKey ||
          e.shiftKey ||
          e.altKey ||
          e.button !== 0
        ) return

        e.preventDefault()
        navigate(props.href)
      }}
    >
      {props.children}
    </a>
  )
}
