export default function Lifecycle() {
  onMount(() => {
    console.log("mounted")
  })
  
  onCleanup(() => {
    console.log("cleaned up")
  })
  
  return <div>Lifecycle</div>
}
