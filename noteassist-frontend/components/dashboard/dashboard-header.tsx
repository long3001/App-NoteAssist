"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, X, Mic, Filter } from "lucide-react"
import { format } from "date-fns"

interface DashboardHeaderProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedTag: string | null
  onTagChange: (tag: string | null) => void
  dateRange: { from: Date | undefined; to: Date | undefined }
  onDateRangeChange: (range: { from: Date | undefined; to: Date | undefined }) => void
}

// Mock tags - in a real app, these would be dynamically generated from recordings
const availableTags = [
  "team",
  "client",
  "product",
  "marketing",
  "sales",
  "weekly",
  "planning",
  "strategy",
  "onboarding",
  "sync",
]

export function DashboardHeader({
  searchQuery,
  onSearchChange,
  selectedTag,
  onTagChange,
  dateRange,
  onDateRangeChange,
}: DashboardHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button className="flex gap-2">
          <Mic className="h-4 w-4" />
          New Recording
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search recordings..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 font-medium">Filter by tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTag === tag ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => onTagChange(selectedTag === tag ? null : tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd")
                    )
                  ) : (
                    "Date Range"
                  )}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{ from: dateRange.from, to: dateRange.to }}
                onSelect={(range) =>
                  onDateRangeChange({
                    from: range?.from,
                    to: range?.to,
                  })
                }
                numberOfMonths={1}
              />
              {(dateRange.from || dateRange.to) && (
                <div className="flex items-center justify-center p-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDateRangeChange({ from: undefined, to: undefined })}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {selectedTag && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtered by:</span>
          <Badge variant="default" className="flex items-center gap-1">
            {selectedTag}
            <X className="h-3 w-3 cursor-pointer" onClick={() => onTagChange(null)} />
          </Badge>
        </div>
      )}
    </div>
  )
}
