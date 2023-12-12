import { Metadata } from "next"

export const metadata: Metadata = {
  title: `first-make-chart`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
}
