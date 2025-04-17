"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Download, Edit, Save, Clock, FileText } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

// Mock note data
const mockNotes: Record<string, any> = {
  "1": {
    id: "1",
    title: "Weekly Team Meeting",
    date: "2023-04-15T10:00:00",
    duration: "45:22",
    template: "Team Meeting",
    tags: ["team", "weekly"],
    transcription:
      "This is the full transcription of the weekly team meeting. It includes all the discussion points, questions, and responses from team members.",
    notes: {
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
  },
  "2": {
    id: "2",
    title: "Client Onboarding Call",
    date: "2023-04-14T14:30:00",
    duration: "32:15",
    template: "Client Call",
    tags: ["client", "onboarding"],
    transcription:
      "This is the full transcription of the client onboarding call. It includes the introduction, client requirements discussion, and next steps.",
    notes: {
      "Client Needs": [
        "Integration with existing CRM system",
        "Custom reporting dashboard",
        "User training for 15 team members",
      ],
      "Action Items": ["Send proposal by end of week (Alex)", "Schedule technical assessment call (Taylor)"],
      "Follow-up Date": ["April 28th for proposal review"],
    },
  },
}

interface NoteViewerProps {
  id: string
}

export function NoteViewer({ id }: NoteViewerProps) {
  const note = mockNotes[id]
  const [isEditing, setIsEditing] = useState(false)
  const [editedNotes, setEditedNotes] = useState<Record<string, string[]>>(note?.notes || {})

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="mb-4 h-12 w-12 text-gray-400" />
        <h2 className="text-xl font-semibold">Note not found</h2>
        <p className="mt-2 text-gray-500">The note you're looking for doesn't exist or has been deleted.</p>
        <Button className="mt-6" asChild>
          <Link href="/">Return to Dashboard</Link>
        </Button>
      </div>
    )
  }

  const handleNoteChange = (category: string, index: number, value: string) => {
    const updatedNotes = { ...editedNotes }
    updatedNotes[category][index] = value
    setEditedNotes(updatedNotes)
  }

  const saveChanges = () => {
    // In a real app, this would save changes to a database
    console.log("Saving changes:", editedNotes)
    setIsEditing(false)
  }

  const exportNote = (format: string) => {
    // In a real app, this would generate and download the file
    console.log(`Exporting note in ${format} format`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">{note.title}</h1>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={saveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Notes
              </Button>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {note.duration}
        </span>
        <span>•</span>
        <span>{formatDistanceToNow(new Date(note.date), { addSuffix: true })}</span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" />
          {note.template}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {note.tags.map((tag: string) => (
          <Badge key={tag} variant="outline">
            {tag}
          </Badge>
        ))}
      </div>

      <Tabs defaultValue="notes">
        <TabsList>
          <TabsTrigger value="notes">AI Notes</TabsTrigger>
          <TabsTrigger value="transcription">Transcription</TabsTrigger>
        </TabsList>
        <TabsContent value="notes" className="space-y-4">
          {Object.entries(note.notes).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    {(items as string[]).map((item, index) => (
                      <Textarea
                        key={index}
                        value={editedNotes[category][index]}
                        onChange={(e) => handleNoteChange(category, index, e.target.value)}
                        className="min-h-[60px]"
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {(items as string[]).map((item, index) => (
                      <li key={index} className="text-sm">
                        • {item}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="transcription">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Full Transcription</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={note.transcription} readOnly className="min-h-[300px] resize-none" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
