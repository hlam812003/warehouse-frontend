import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Dashboard',
  icons: {
    icon: '/icon.png'
  }
}

export default function EmployeeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}