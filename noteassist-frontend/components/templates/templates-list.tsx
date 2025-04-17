"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Search, MoreHorizontal, Copy } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock templates data
const mockTemplates = [
  {
    id: "1",
    name: "Team Meeting",
    description: "Standard template for weekly team meetings",
    fields: ["Action Items", "Decisions", "Next Steps"],
    isDefault: true,
    usageCount: 24,
  },
  {
    id: "2",
    name: "Client Call",
    description: "Template for client calls and follow-ups",
    fields: ["Client Needs", "Action Items", "Follow-up Date"],
    isDefault: false,
    usageCount: 18,
  },
  {
    id: "3",
    name: "Project Planning",
    description: "Comprehensive template for project planning sessions",
    fields: ["Goals", "Timeline", "Resource Allocation", "Risks"],
    isDefault: false,
    usageCount: 12,
  },
  {
    id: "4",
    name: "Lecture Notes",
    description: "Template for academic lectures and classes",
    fields: ["Key Concepts", "Examples", "Questions"],
    isDefault: false,
    usageCount: 8,
  },
  {
    id: "5",
    name: "Sales Call",
    description: "Template for sales calls and prospect meetings",
    fields: ["Client Information", "Pain Points", "Solutions Discussed", "Next Steps"],
    isDefault: false,
    usageCount: 15,
  },
]

export function TemplatesList() {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter templates based on search
  const filteredTemplates = mockTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Templates</h1>
        <Button asChild>
          <Link href="/templates/new">
            <Plus className="mr-2 h-4 w-4" />
            New Template
          </Link>
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Search templates..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {template.name}
                    {template.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">More options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/templates/${template.id}`} className="flex w-full items-center">
                        Edit template
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <div className="flex items-center">
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </div>
                    </DropdownMenuItem>
                    {!template.isDefault && <DropdownMenuItem>Set as default</DropdownMenuItem>}
                    {!template.isDefault && <DropdownMenuItem className="text-red-500">Delete</DropdownMenuItem>}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span>{template.fields.length} fields</span>
                  <span>•</span>
                  <span>Used {template.usageCount} times</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {template.fields.map((field) => (
                    <Badge key={field} variant="outline">
                      {field}
                    </Badge>
                  ))}
                </div>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <Link href={`/templates/${template.id}`}>Use Template</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
