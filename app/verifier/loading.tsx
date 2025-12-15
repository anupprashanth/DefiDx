export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2" />
          <div className="h-4 w-96 bg-muted animate-pulse rounded mb-8" />
          
          <div className="bg-card border border-border rounded-lg p-8">
            <div className="h-6 w-32 bg-muted animate-pulse rounded mb-6" />
            <div className="space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded" />
              <div className="h-10 w-32 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
