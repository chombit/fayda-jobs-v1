// Temporary test without Supabase
export default function TestPage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Supabase Connection Test</h1>
      <p>If you can see this page, Next.js is working.</p>
      <p>Supabase connection needs to be fixed.</p>
      
      <h2>Current Status:</h2>
      <ul>
        <li>✅ Next.js: Working</li>
        <li>❌ Supabase: Connection Error</li>
        <li>🔧 API Key: Needs Update</li>
      </ul>
      
      <h2>Next Steps:</h2>
      <ol>
        <li>Get new API key from Supabase Dashboard</li>
        <li>Update .env file</li>
        <li>Restart development server</li>
      </ol>
    </div>
  );
}
