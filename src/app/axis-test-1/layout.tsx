import { Metadata } from "next"

export const metadata: Metadata = {
  title: `axis-test-1`,
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
