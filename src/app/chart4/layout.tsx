import { Metadata } from "next"

export const metadata: Metadata = {
  title: `chart4`,
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
