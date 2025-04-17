"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mic, Pause, Play, Square, Save } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

// Mock templates
const mockTemplates = [
  { id: "1", name: "Team Meeting", fields: ["Action Items", "Decisions", "Next Steps"] },
  { id: "2", name: "Client Call", fields: ["Client Needs", "Action Items", "Follow-up Date"] },
  { id: "3", name: "Project Planning", fields: ["Goals", "Timeline", "Resource Allocation", "Risks"] },
  { id: "4", name: "Lecture Notes", fields: ["Key Concepts", "Examples", "Questions"] },
  { id: "5", name: "Sales Call", fields: ["Client Information", "Pain Points", "Solutions Discussed", "Next Steps"] },
]

type RecordingStatus = "idle" | "recording" | "paused" | "completed" | "processing"

export function RecordingInterface() {
  const [status, setStatus] = useState<RecordingStatus>("idle")
  const [duration, setDuration] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [title, setTitle] = useState("")
  const [transcription, setTranscription] = useState("")
  const [processingProgress, setProcessingProgress] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedDurationRef = useRef<number>(0)

  // Format seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Start recording
  const startRecording = () => {
    if (status === "idle" || status === "paused") {
      setStatus("recording")
      startTimeRef.current = Date.now() - pausedDurationRef.current * 1000

      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
          setDuration(elapsed)
        }
      }, 1000)
    }
  }

  // Pause recording
  const pauseRecording = () => {
    if (status === "recording") {
      setStatus("paused")
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      pausedDurationRef.current = duration
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (status === "recording" || status === "paused") {
      setStatus("processing")
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }

      // Simulate processing
      let progress = 0
      const processingInterval = setInterval(() => {
        progress += 5
        setProcessingProgress(progress)

        if (progress >= 100) {
          clearInterval(processingInterval)
          setStatus("completed")
          // Mock transcription
          setTranscription(
            "This is a simulated transcription of the recorded conversation. In a real application, this would be the actual transcription from the audio recording processed by Google Cloud Speech-to-Text API.\n\nThe AI would then analyze this transcription to extract structured notes based on the selected template fields.",
          )
        }
      }, 200)
    }
  }

  // Reset recording
  const resetRecording = () => {
    setStatus("idle")
    setDuration(0)
    setProcessingProgress(0)
    setTranscription("")
    pausedDurationRef.current = 0
    startTimeRef.current = null
  }

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Mock AI-generated notes based on selected template
  const getAINotes = () => {
    if (status !== "completed" || !selectedTemplate) return null

    const template = mockTemplates.find((t) => t.id === selectedTemplate)
    if (!template) return null

    return template.fields.map((field) => ({
      field,
      content: `This is AI-generated content for the "${field}" field based on the transcription. In a real application, this would be extracted from the transcription using AI processing.`,
    }))
  }

  const aiNotes = getAINotes()

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">New Recording</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recording</CardTitle>
            <CardDescription>Record your conversation and generate structured notes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Recording Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full rounded-md border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter a title for your recording"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={status === "recording" || status === "processing"}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="template" className="text-sm font-medium">
                Note Template
              </label>
              <Select
                value={selectedTemplate}
                onValueChange={setSelectedTemplate}
                disabled={status === "recording" || status === "processing"}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {mockTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedTemplate && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {mockTemplates
                    .find((t) => t.id === selectedTemplate)
                    ?.fields.map((field) => (
                      <Badge key={field} variant="outline">
                        {field}
                      </Badge>
                    ))}
                </div>
              )}
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      status === "recording"
                        ? "animate-pulse bg-red-500"
                        : status === "paused"
                          ? "bg-amber-500"
                          : status === "processing"
                            ? "bg-blue-500"
                            : status === "completed"
                              ? "bg-green-500"
                              : "bg-gray-200"
                    }`}
                  >
                    <Mic className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      {status === "idle"
                        ? "Ready to Record"
                        : status === "recording"
                          ? "Recording..."
                          : status === "paused"
                            ? "Paused"
                            : status === "processing"
                              ? "Processing..."
                              : "Completed"}
                    </div>
                    <div className="text-xs text-gray-500">{formatTime(duration)}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {(status === "idle" || status === "paused") && (
                    <Button
                      size="sm"
                      onClick={startRecording}
                      disabled={!selectedTemplate || status === "processing" || status === "completed"}
                    >
                      <Play className="mr-1 h-4 w-4" />
                      {status === "paused" ? "Resume" : "Start"}
                    </Button>
                  )}
                  {status === "recording" && (
                    <Button size="sm" variant="outline" onClick={pauseRecording}>
                      <Pause className="mr-1 h-4 w-4" />
                      Pause
                    </Button>
                  )}
                  {(status === "recording" || status === "paused") && (
                    <Button size="sm" variant="destructive" onClick={stopRecording}>
                      <Square className="mr-1 h-4 w-4" />
                      Stop
                    </Button>
                  )}
                  {status === "completed" && (
                    <Button size="sm" variant="outline" onClick={resetRecording}>
                      <Mic className="mr-1 h-4 w-4" />
                      New Recording
                    </Button>
                  )}
                </div>
              </div>

              {status === "processing" && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Processing recording...</div>
                  <Progress value={processingProgress} className="h-2" />
                </div>
              )}

              {status === "completed" && (
                <Tabs defaultValue="transcription">
                  <TabsList className="mb-2">
                    <TabsTrigger value="transcription">Transcription</TabsTrigger>
                    <TabsTrigger value="notes">AI Notes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="transcription" className="space-y-4">
                    <Textarea
                      value={transcription}
                      onChange={(e) => setTranscription(e.target.value)}
                      className="min-h-[200px] resize-none"
                      readOnly
                    />
                  </TabsContent>
                  <TabsContent value="notes" className="space-y-4">
                    {aiNotes ? (
                      <div className="space-y-4">
                        {aiNotes.map((note, index) => (
                          <div key={index} className="space-y-2">
                            <h4 className="text-sm font-medium">{note.field}</h4>
                            <Textarea value={note.content} className="min-h-[100px] resize-none" readOnly />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-sm text-gray-500">
                        No notes available. Please select a template and complete a recording.
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </div>
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" disabled={status !== "completed"}>
              Discard
            </Button>
            <Button disabled={status !== "completed"}>
              <Save className="mr-2 h-4 w-4" />
              Save Notes
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">1. Select a Template</h3>
                <p className="text-xs text-gray-500">
                  Choose a template that defines how your notes will be structured.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">2. Start Recording</h3>
                <p className="text-xs text-gray-500">Click the Start button to begin recording your conversation.</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">3. Stop When Finished</h3>
                <p className="text-xs text-gray-500">
                  Click Stop when you're done. The recording will be processed automatically.
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium">4. Review and Save</h3>
                <p className="text-xs text-gray-500">
                  Review the transcription and AI-generated notes, then save them to your dashboard.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">{mockTemplates.find((t) => t.id === selectedTemplate)?.name}</h3>
                  <div className="space-y-1">
                    {mockTemplates
                      .find((t) => t.id === selectedTemplate)
                      ?.fields.map((field) => (
                        <div key={field} className="text-xs text-gray-500">
                          • {field}
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500">Select a template to see its structure</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
