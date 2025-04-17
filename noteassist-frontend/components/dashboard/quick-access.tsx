import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { FileText, Plus } from "lucide-react"
import Link from "next/link"

interface Template {
  id: string
  name: string
  fields: string[]
}

interface Recording {
  id: string
  title: string
  date: string
  duration: string
  template: string
  tags: string[]
  status: string
}

interface QuickAccessProps {
  templates: Template[]
  recentRecordings: Recording[]
}

export function QuickAccess({ templates, recentRecordings }: QuickAccessProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Templates</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2 text-xs">
            <Plus className="h-3.5 w-3.5" />
            New
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {templates.slice(0, 3).map((template) => (
              <div
                key={template.id}
                className="flex items-center justify-between rounded-md border border-gray-200 p-2 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">{template.name}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  Use
                </Button>
              </div>
            ))}
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-xs" asChild>
              <Link href="/templates">View all templates</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recent Recordings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentRecordings.map((recording) => (
              <Link key={recording.id} href={`/notes/${recording.id}`} className="block">
                <div className="flex flex-col rounded-md border border-gray-200 p-2 transition-colors hover:bg-gray-50">
                  <span className="text-sm font-medium">{recording.title}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>{formatDistanceToNow(new Date(recording.date), { addSuffix: true })}</span>
                    <span>•</span>
                    <span>{recording.duration}</span>
                  </div>
                </div>
              </Link>
            ))}
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-xs" asChild>
              <Link href="/recordings">View all recordings</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
