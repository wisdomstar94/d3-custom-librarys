import ContentArea from '@/components/layouts/content-area/content-area.component';
import SideBar from '@/components/layouts/side-bar/side-bar.component';
import '@/styles/globals.scss';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <SideBar />
        <ContentArea>
          {children}
        </ContentArea>
      </body>
    </html>
  )
}
