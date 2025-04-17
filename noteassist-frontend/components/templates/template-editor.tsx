"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, X, Save, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function TemplateEditor() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [fields, setFields] = useState<string[]>([])
  const [newField, setNewField] = useState("")

  const addField = () => {
    if (newField.trim() && !fields.includes(newField.trim())) {
      setFields([...fields, newField.trim()])
      setNewField("")
    }
  }

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addField()
    }
  }

  const saveTemplate = () => {
    // In a real app, this would save the template to a database
    console.log("Saving template:", { name, description, fields })

    // Navigate back to templates list
    router.push("/templates")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/templates">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create Template</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Template Name
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Team Meeting, Client Call"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this template is used for"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="fields" className="text-sm font-medium">
              Template Fields
            </label>
            <p className="text-xs text-gray-500">
              Define the fields that will structure your notes. The AI will extract information for each field.
            </p>

            <div className="flex gap-2">
              <Input
                id="fields"
                value={newField}
                onChange={(e) => setNewField(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., Action Items, Decisions, Next Steps"
              />
              <Button type="button" onClick={addField} disabled={!newField.trim()}>
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              {fields.length === 0 ? (
                <div className="rounded-md border border-dashed border-gray-200 p-4 text-center text-sm text-gray-500">
                  No fields added yet. Add fields to define your template structure.
                </div>
              ) : (
                <div className="space-y-2">
                  {fields.map((field, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border border-gray-200 p-2"
                    >
                      <span className="text-sm">{field}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeField(index)}>
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-between">
          <Button variant="outline" asChild>
            <Link href="/templates">Cancel</Link>
          </Button>
          <Button onClick={saveTemplate} disabled={!name || fields.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
