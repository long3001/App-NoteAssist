export function DashboardPlaceholder() {
  return (
    <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center">
      <h2 className="text-2xl font-semibold text-gray-900">Welcome to NoteAssist</h2>
      <p className="mt-2 text-gray-600">Record conversations and generate structured notes automatically</p>
      <div className="mt-6">
        <p className="text-sm text-gray-500">This is a placeholder for the dashboard content</p>
      </div>
    </div>
  )
}
