export default function Root() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Posts</h1>
        <a href="/write/" className="text-blue-400 hover:underline text-xl">
          Go to Editor
        </a>
      </div>
    </div>
  )
}