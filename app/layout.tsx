import type { Metadata } from 'next'
import { ChakraProvider } from '@chakra-ui/react'
import NavBar from '@/components/NavBar'

export const metadata: Metadata = {
  title: 'Kanban Board',
  description: 'Kanban Board for managing tasks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body>
        <ChakraProvider>
          <NavBar/>
          {children}
        </ChakraProvider>
      </body>
    </html>
  )
}
