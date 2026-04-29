export default function ShopPage(props) {
  return (
    <div>
      <h1 className="text-2xl font-bold">Shop</h1>
      <p className="mt-4">Slug segments: </p>
      <ul className="list-disc ml-6 mt-2">
        {props.params.slug.map(segment => (
          <li>{segment}</li>
        ))}
      </ul>
      <div className="mt-4 p-4 bg-slate-800 rounded">
        Full path: <span className="text-indigo-400 font-mono">/shop/{props.params.slug.join('/')}</span>
      </div>
    </div>
  );
}
