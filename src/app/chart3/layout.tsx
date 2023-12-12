import { Metadata } from "next"

export const metadata: Metadata = {
  title: `chart3`,
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
