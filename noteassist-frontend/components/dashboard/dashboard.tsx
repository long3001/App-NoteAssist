"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RecordingsList } from "@/components/dashboard/recordings-list"
import { QuickAccess } from "@/components/dashboard/quick-access"
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard"

// Mock data - in a real app, this would come from an API
const mockRecordings = [
  {
    id: "1",
    title: "Weekly Team Meeting",
    date: "2023-04-15T10:00:00",
    duration: "45:22",
    template: "Team Meeting",
    tags: ["team", "weekly"],
    status: "completed",
  },
  {
    id: "2",
    title: "Client Onboarding Call",
    date: "2023-04-14T14:30:00",
    duration: "32:15",
    template: "Client Call",
    tags: ["client", "onboarding"],
    status: "completed",
  },
  {
    id: "3",
    title: "Product Planning Session",
    date: "2023-04-12T09:00:00",
    duration: "58:43",
    template: "Project Planning",
    tags: ["product", "planning"],
    status: "completed",
  },
  {
    id: "4",
    title: "Marketing Strategy Discussion",
    date: "2023-04-10T15:00:00",
    duration: "41:18",
    template: "Strategy Meeting",
    tags: ["marketing", "strategy"],
    status: "completed",
  },
  {
    id: "5",
    title: "Sales Team Sync",
    date: "2023-04-08T11:00:00",
    duration: "28:55",
    template: "Team Meeting",
    tags: ["sales", "sync"],
    status: "completed",
  },
]

const mockTemplates = [
  { id: "1", name: "Team Meeting", fields: ["Action Items", "Decisions", "Next Steps"] },
  { id: "2", name: "Client Call", fields: ["Client Needs", "Action Items", "Follow-up Date"] },
  { id: "3", name: "Project Planning", fields: ["Goals", "Timeline", "Resource Allocation", "Risks"] },
]

export function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })

  // Filter recordings based on search, tags, and date
  const filteredRecordings = mockRecordings.filter((recording) => {
    // Search filter
    const matchesSearch = searchQuery
      ? recording.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recording.template.toLowerCase().includes(searchQuery.toLowerCase())
      : true

    // Tag filter
    const matchesTag = selectedTag ? recording.tags.includes(selectedTag) : true

    // Date filter
    let matchesDate = true
    if (dateRange.from) {
      const recordingDate = new Date(recording.date)
      matchesDate = recordingDate >= dateRange.from
      if (dateRange.to) {
        matchesDate = matchesDate && recordingDate <= dateRange.to
      }
    }

    return matchesSearch && matchesTag && matchesDate
  })

  // Check if user has any recordings
  const hasRecordings = mockRecordings.length > 0

  return (
    <div className="space-y-6">
      <DashboardHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      {hasRecordings ? (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecordingsList recordings={filteredRecordings} />
            </div>
            <div>
              <QuickAccess templates={mockTemplates} recentRecordings={mockRecordings.slice(0, 3)} />
            </div>
          </div>
        </>
      ) : (
        <EmptyDashboard />
      )}
    </div>
  )
}
