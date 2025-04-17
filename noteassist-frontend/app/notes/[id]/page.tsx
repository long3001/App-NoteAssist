import { NoteViewer } from "@/components/notes/note-viewer"
import { AppLayout } from "@/components/app-layout"

interface NoteViewerPageProps {
  params: {
    id: string
  }
}

export default function NoteViewerPage({ params }: NoteViewerPageProps) {
  return (
    <AppLayout>
      <NoteViewer id={params.id} />
    </AppLayout>
  )
}
