// The root layout is required, but the main layout will be at [locale]/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children;
}