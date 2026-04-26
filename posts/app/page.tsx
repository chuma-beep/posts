import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Posts</h1>
        <p className="text-muted-foreground">Public notes and thoughts</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>No posts yet. Create your first post to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This is a simple blogging platform where you can write and publish posts.
            Use the Write page to create new posts in Markdown format.
          </p>
        </CardContent>
        <CardFooter>
          <Link href="/write/">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Post
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}