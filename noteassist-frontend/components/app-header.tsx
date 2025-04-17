"use client"

import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { UserCircle } from "lucide-react"

export function AppHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold text-black">NoteAssist</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="rounded-full" asChild>
            <Link href="/auth/sign-in">
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Sign In</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
