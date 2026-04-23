import { navigate } from "./index"

export default function Link(props) {
  return (
    <a
      href={props.href}
      className={props.className}
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
        window.scrollTo(0, 0)
      }}
    >
      {props.children}
    </a>
  )
}
