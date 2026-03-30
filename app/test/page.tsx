export default function TestPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-foreground mb-4">
        Test Page
      </h1>
      <p className="text-muted-foreground mb-4">
        If you can see this with styling, the CSS is working.
      </p>
      <div className="bg-card p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-2">Card Test</h2>
        <p className="text-muted-foreground">
          This should have a card background and border.
        </p>
      </div>
    </div>
  );
}
