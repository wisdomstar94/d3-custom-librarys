import { Metadata } from "next"

export const metadata: Metadata = {
  title: `half-arc`,
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
