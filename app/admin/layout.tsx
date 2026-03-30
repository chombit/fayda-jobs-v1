export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is handled in app/admin/page.tsx
  return <>{children}</>;
}
