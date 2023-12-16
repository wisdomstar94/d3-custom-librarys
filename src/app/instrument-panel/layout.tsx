import { Metadata } from "next"

export const metadata: Metadata = {
  title: `instrument-panel`,
};

export default function Layout({
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
