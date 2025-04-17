import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, FileText, Mic } from "lucide-react"

interface Recording {
  id: string
  title: string
  date: string
  duration: string
  template: string
  tags: string[]
  status: string
}

interface DashboardStatsProps {
  recordings: Recording[]
}

export function DashboardStats({ recordings }: DashboardStatsProps) {
  // Calculate total recording time
  const totalMinutes = recordings.reduce((total, recording) => {
    const [minutes, seconds] = recording.duration.split(":").map(Number)
    return total + minutes + seconds / 60
  }, 0)

  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.floor(totalMinutes % 60)

  // Get unique templates count
  const uniqueTemplates = new Set(recordings.map((recording) => recording.template)).size

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
          <Mic className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recordings.length}</div>
          <p className="text-xs text-gray-500">All time recordings</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Recording Time</CardTitle>
          <Clock className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {hours}h {minutes}m
          </div>
          <p className="text-xs text-gray-500">Total duration</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
          <FileText className="h-4 w-4 text-gray-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueTemplates}</div>
          <p className="text-xs text-gray-500">Unique templates</p>
        </CardContent>
      </Card>
    </div>
  )
}
