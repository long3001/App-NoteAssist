import type React from "react"
import Link from "next/link"
import { Mic } from "lucide-react"

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black">
                <Mic className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">NoteAssist</span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">{title}</h2>
          <p className="mt-2 text-center text-sm text-gray-600">{description}</p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-6 py-8 shadow-sm ring-1 ring-gray-200 sm:rounded-lg sm:px-8">{children}</div>
        </div>
      </div>
    </div>
  )
}
