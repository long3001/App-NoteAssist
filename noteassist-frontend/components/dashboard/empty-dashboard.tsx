import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"

export function EmptyDashboard() {
  return (
    <div className="space-y-6">
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle>Welcome to NoteAssist</CardTitle>
          <CardDescription>Get started by creating your first recording or template</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center rounded-lg border border-gray-200 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Mic className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-medium">Start Recording</h3>
            <p className="mt-2 text-sm text-gray-500">
              Record conversations, meetings, or lectures and let AI generate structured notes.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/recordings/new">
                New Recording
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-col items-center rounded-lg border border-gray-200 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-medium">Create Template</h3>
            <p className="mt-2 text-sm text-gray-500">
              Define custom fields to structure your notes or choose from predefined templates.
            </p>
            <Button className="mt-4" variant="outline" asChild>
              <Link href="/templates/new">
                New Template
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t bg-gray-50 px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            Need help getting started? Check out our{" "}
            <Link href="/help" className="font-medium text-black hover:underline">
              guide
            </Link>{" "}
            or{" "}
            <Link href="/help" className="font-medium text-black hover:underline">
              watch a tutorial
            </Link>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
