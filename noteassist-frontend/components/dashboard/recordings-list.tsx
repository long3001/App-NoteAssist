"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { ChevronDown, ChevronUp, Clock, FileText, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import Link from "next/link"

interface Recording {
  id: string
  title: string
  date: string
  duration: string
  template: string
  tags: string[]
  status: string
}

interface RecordingsListProps {
  recordings: Recording[]
}

// Mock AI-generated notes for each recording
const mockNotes = {
  "1": {
    "Action Items": [
      "Update project timeline by Friday (John)",
      "Schedule follow-up meeting with design team (Sarah)",
      "Finalize Q2 budget proposal (Michael)",
    ],
    Decisions: ["Approved new marketing campaign strategy", "Postponed product launch to Q3"],
    "Next Steps": [
      "Team to review updated requirements doc by Wednesday",
      "Weekly status updates to be shared in Slack channel",
    ],
  },
  "2": {
    "Client Needs": [
      "Integration with existing CRM system",
      "Custom reporting dashboard",
      "User training for 15 team members",
    ],
    "Action Items": ["Send proposal by end of week (Alex)", "Schedule technical assessment call (Taylor)"],
    "Follow-up Date": ["April 28th for proposal review"],
  },
  "3": {
    Goals: ["Launch MVP by end of Q2", "Achieve 500 beta users within first month"],
    Timeline: ["Design phase: 2 weeks", "Development: 6 weeks", "Testing: 2 weeks", "Launch preparation: 1 week"],
    "Resource Allocation": ["2 designers, 4 developers, 1 QA specialist", "Marketing team to join in week 8"],
    Risks: ["Dependency on third-party API integration", "Potential resource conflict with Project B in week 5"],
  },
  "4": {
    "Key Points": [
      "Focus on social media growth in Q2",
      "Allocate 30% more budget to digital advertising",
      "Explore partnership opportunities with complementary brands",
    ],
    "Action Items": [
      "Develop content calendar for next quarter (Marketing team)",
      "Research new analytics tools (Data team)",
    ],
  },
  "5": {
    Updates: ["Q1 targets exceeded by 12%", "New sales territories assigned", "CRM update scheduled for next month"],
    "Action Items": [
      "Complete training on new proposal tool (All team)",
      "Schedule customer success stories interviews (Jordan)",
    ],
  },
}

export function RecordingsList({ recordings }: RecordingsListProps) {
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({})

  const toggleNotes = (id: string) => {
    setOpenNotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (recordings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recordings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="mb-2 h-10 w-10 text-gray-400" />
            <h3 className="text-lg font-medium">No recordings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recordings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recordings.map((recording) => (
            <Collapsible
              key={recording.id}
              open={openNotes[recording.id]}
              onOpenChange={() => toggleNotes(recording.id)}
              className="rounded-lg border border-gray-200 transition-colors hover:bg-gray-50"
            >
              <div className="flex flex-col p-4 sm:flex-row sm:items-center">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <Link href={`/notes/${recording.id}`} className="hover:underline">
                      <h3 className="font-medium">{recording.title}</h3>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/notes/${recording.id}`}>View details</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit notes</DropdownMenuItem>
                        <DropdownMenuItem>Export</DropdownMenuItem>
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {recording.duration}
                    </span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(recording.date), { addSuffix: true })}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <FileText className="h-3.5 w-3.5" />
                      {recording.template}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recording.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 sm:mt-0 sm:ml-4">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex gap-1">
                      {openNotes[recording.id] ? (
                        <>
                          <ChevronUp className="h-3.5 w-3.5" />
                          Hide Notes
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-3.5 w-3.5" />
                          View Notes
                        </>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Button variant="outline" size="sm" className="flex gap-2" asChild>
                    <Link href={`/notes/${recording.id}`}>
                      <FileText className="h-3.5 w-3.5" />
                      View Full
                    </Link>
                  </Button>
                </div>
              </div>
              <CollapsibleContent>
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 text-sm font-medium">AI-Generated Notes</h4>
                  <div className="space-y-4">
                    {mockNotes[recording.id as keyof typeof mockNotes] &&
                      Object.entries(mockNotes[recording.id as keyof typeof mockNotes]).map(([category, items]) => (
                        <div key={category}>
                          <h5 className="text-xs font-medium uppercase text-gray-500">{category}</h5>
                          <ul className="mt-1 space-y-1">
                            {items.map((item, index) => (
                              <li key={index} className="text-sm">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
