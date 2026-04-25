'use client'

import { useState, useEffect, useRef } from "react"
import readingTime from 'reading-time'

type Post = {
  id: number
  title: string
  author: string
  date: string
  category: string
  readTime: string
  content: string
  tags: string[]
}

export default function Editor() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [tags, setTags] = useState('')
  const [content, setContent] = useState('')
  const [lastSaved, setLastSaved] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('post-draft')
    if (saved) {
      const draft = JSON.parse(saved)
      setTitle(draft.title || '')
      setCategory(draft.category || '')
      setTags(draft.tags || '')
      setContent(draft.content || '')
    }
  }, [])

  useEffect(() => {
    const draft = { title, category, tags, content }
    localStorage.setItem('post-draft', JSON.stringify(draft))
    setLastSaved(new Date().toLocaleTimeString())
  }, [title, category, tags, content])

  const handleDownload = () => {
    if (!title) {
      alert('Please add a title')
      return
    }

    const readTimeResult = readingTime(content)
    const post: Post = {
      id: Date.now(),
      title,
      author: 'k1_bot',
      date: new Date().toISOString().split('T')[0],
      category,
      readTime: readTimeResult.text,
      content,
      tags: tags.split(',').map(t => t.trim()),
    }

    const blob = new Blob([JSON.stringify(post, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `post-${post.id}.json`
    a.click()
    URL.revokeObjectURL(url)

    alert('Post downloaded!')
    localStorage.removeItem('post-draft')
    setTitle('')
    setTags('')
    setCategory('')
    setContent('')
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-white mb-4">Write Post</h1>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 w-full text-white bg-gray-800 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 w-full text-white bg-gray-800 mb-2 rounded"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="border p-2 w-full text-white bg-gray-800 mb-4 rounded"
        />

        {lastSaved && (
          <div className="bg-gray-800 text-white p-2 rounded-lg mb-4 text-sm">
            Auto-saved: {lastSaved}
          </div>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here (Markdown supported)..."
          className="w-full h-96 p-4 bg-gray-800 text-white rounded-lg font-mono"
        />

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={handleDownload}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg"
          >
            Download JSON
          </button>
        </div>
      </div>
    </div>
  )
}