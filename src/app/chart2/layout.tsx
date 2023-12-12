import { Metadata } from "next"

export const metadata: Metadata = {
  title: `chart2`,
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
