export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <head />
      {children}
    </>
  )
}
