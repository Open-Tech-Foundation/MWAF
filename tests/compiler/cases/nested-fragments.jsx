export default function NestedFragments() {
  const show = $state(true)
  return (
    <div>
      {show && (
        <>
          <span>A</span>
          <>
            <span>B</span>
            <span>C</span>
          </>
        </>
      )}
    </div>
  )
}
