import type { Metadata } from 'next'
import { ChakraProvider } from '@chakra-ui/react'

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
        <ChakraProvider>{children}</ChakraProvider>
      </body>
    </html>
  )
}
