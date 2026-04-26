import { execSync } from "child_process"
import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join, dirname } from "path"
import { existsSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const post = await request.json()

    if (!post.title || !post.content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      )
    }

    const filename = `post-${post.id}.json`
    const postsDir = join(process.cwd(), "posts")

    if (!existsSync(postsDir)) {
      await mkdir(postsDir, { recursive: true })
    }

    const filepath = join(postsDir, filename)
    await writeFile(filepath, JSON.stringify(post, null, 2), "utf-8")

    try {
      execSync(`git add posts/${filename}`, { cwd: process.cwd() })
      execSync(`git commit -m "Add ${post.title}"`, { cwd: process.cwd() })
      execSync(`git push origin main`, { cwd: process.cwd() })
    } catch (gitError) {
      console.error("Git error:", gitError)
    }

    return NextResponse.json({ success: true, filename })
  } catch (error) {
    console.error("Error saving post:", error)
    return NextResponse.json(
      { error: "Failed to save post" },
      { status: 500 }
    )
  }
}