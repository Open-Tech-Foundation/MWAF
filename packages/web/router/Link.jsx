import { navigate, router } from "./index.js"

export default function Link(props) {
  return (
    <a
      href={props.href}
      className={props.className}
      style={props.style}
      onclick={(e) => {
        const isMPA = router.config.mode?.navigation === 'mpa';
        
        if (
          isMPA ||
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
