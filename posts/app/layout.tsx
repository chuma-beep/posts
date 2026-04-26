import "./globals.css"
import type { Metadata } from "next"
import { JetBrains_Mono } from "next/font/google"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Posts",
  description: "Public notes",
}

const mono = JetBrains_Mono({ subsets: ["latin"] })

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={mono.className}>
        <div className="min-h-screen bg-background text-foreground">
          <header className="border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-tight">
                posts
              </Link>
              <nav className="flex items-center gap-4">
                <Link href="/">
                  <Button variant="ghost" size="sm">Home</Button>
                </Link>
                <Link href="/write/">
                  <Button size="sm">Write</Button>
                </Link>
              </nav>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}