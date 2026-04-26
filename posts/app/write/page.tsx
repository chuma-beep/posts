'use client'

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Download, Save, Trash2, GitBranch, Loader2 } from "lucide-react"
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
  const [wordCount, setWordCount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [savedRemotely, setSavedRemotely] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length
    setWordCount(words)
  }, [content])

  const handleSave = async () => {
    if (!title) {
      alert('Please add a title')
      return
    }

    setSaving(true)
    try {
      const readTimeResult = readingTime(content)
      const post: Post = {
        id: Date.now(),
        title,
        author: 'k1_bot',
        date: new Date().toISOString().split('T')[0],
        category,
        readTime: readTimeResult.text,
        content,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      }

      const res = await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post),
      })

      if (!res.ok) throw new Error('Failed to save')

      setSavedRemotely(true)
      localStorage.removeItem('post-draft')
      setTitle('')
      setTags('')
      setCategory('')
      setContent('')
      alert('Post saved to GitHub!')
    } catch (error) {
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

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
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
    }

    const blob = new Blob([JSON.stringify(post, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `post-${post.id}.json`
    a.click()
    URL.revokeObjectURL(url)

    localStorage.removeItem('post-draft')
    setTitle('')
    setTags('')
    setCategory('')
    setContent('')
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the editor? This cannot be undone.')) {
      localStorage.removeItem('post-draft')
      setTitle('')
      setTags('')
      setCategory('')
      setContent('')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Write a Post</CardTitle>
          <CardDescription>Create a new post. Your work is auto-saved locally.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Tech, Life"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="comma-separated"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>

          {tags && (
            <div className="flex flex-wrap gap-2">
              {tags.split(',').map((tag, i) => tag.trim() && (
                <Badge key={i} variant="secondary">{tag.trim()}</Badge>
              ))}
            </div>
          )}

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              ref={textareaRef}
              placeholder="Write your post content here (Markdown supported)..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] font-mono"
            />
          </div>

          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{wordCount} words</span>
            <span>{readingTime(content).text}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
          <div className="flex gap-2">
            {lastSaved && !savedRemotely && (
              <span className="text-sm text-muted-foreground flex items-center">
                <Save className="mr-1 h-3 w-3" />
                {lastSaved}
              </span>
            )}
            {savedRemotely && (
              <span className="text-sm text-green-500 flex items-center">
                <GitBranch className="mr-1 h-3 w-3" />
                Saved
              </span>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <GitBranch className="mr-2 h-4 w-4" />
              )}
              Save to GitHub
            </Button>
            <Button variant="secondary" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}