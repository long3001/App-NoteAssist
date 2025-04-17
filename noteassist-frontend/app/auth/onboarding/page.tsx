import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mic, FileText, LayoutDashboard } from "lucide-react"

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-black">
            <Mic className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-4 text-2xl font-bold">Welcome to NoteAssist</h1>
          <p className="mt-2 text-gray-600">Your smart note-taking assistant</p>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Record Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <Mic className="h-4 w-4" />
                </div>
                <CardDescription>
                  Record meetings, lectures, or any conversation and let NoteAssist transcribe it for you.
                </CardDescription>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Create Custom Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <FileText className="h-4 w-4" />
                </div>
                <CardDescription>
                  Define how your notes should be structured with custom templates or choose from predefined ones.
                </CardDescription>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">AI-Powered Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <LayoutDashboard className="h-4 w-4" />
                </div>
                <CardDescription>
                  Our AI automatically structures your transcriptions into organized notes based on your templates.
                </CardDescription>
              </div>
            </CardContent>
          </Card>
        </div>

        <CardFooter className="flex justify-center p-0 pt-4">
          <Button asChild className="w-full">
            <Link href="/">Go to Dashboard</Link>
          </Button>
        </CardFooter>
      </div>
    </div>
  )
}
