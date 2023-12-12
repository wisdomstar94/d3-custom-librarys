import ContentArea from '@/components/layouts/content-area/content-area.component';
import SideBar from '@/components/layouts/side-bar/side-bar.component';
import '@/styles/globals.scss';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
  title: `d3-custom-librarys`,
  description: `This is d3-custom-librarys`,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

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
