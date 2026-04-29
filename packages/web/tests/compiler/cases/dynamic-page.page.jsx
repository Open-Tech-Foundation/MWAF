
export default function PostPage(props) {
  onMount(() => {
    console.log(`Post page mounted with ID: ${props.params.id}`)
  })

  onCleanup(() => {
    console.log(`Post page cleaned up with ID: ${props.params.id}`)
  })

  return (
    <div>
      <h1 className="text-2xl font-bold">Post {props.params.id}</h1>
      <p className="mt-4">This is a dynamic post page for ID: <span className="font-mono bg-gray-200 px-1">{props.params.id}</span></p>
    </div>
  );
}
