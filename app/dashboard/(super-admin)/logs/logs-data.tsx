import React from 'react'

import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import { LOG_TYPES } from '@/constants'
import { formatDate } from '@/lib/utils'
import { Log, LogLevel } from '@/types'

interface LogsDataProps {
  data: Log[]
  table: any
}

const LOG_LEVEL_STYLES: Record<LogLevel, { className: string }> = {
  [LOG_TYPES.INFO]: {
    className: 'dark:bg-primary/10 dark:text-primary'
  },
  [LOG_TYPES.WARNING]: {
    className: 'dark:bg-yellow-500/30 dark:text-yellow-500'
  },
  [LOG_TYPES.ERROR]: {
    className: 'dark:bg-destructive/30 dark:text-red-500'
  }
} as const

const LogLevelBadge = ({ level }: { level: LogLevel }) => {
  const style = LOG_LEVEL_STYLES[level] || LOG_LEVEL_STYLES.INFO

  return (
    <Badge variant="outline" className={style.className}>
      {level}
    </Badge>
  )
}

export default function LogsData({ data, table }: LogsDataProps) {
  const rows = table.getRowModel().rows

  return (
    <>
      {rows.map((row: any) => {
        const log = row.original
        return (
          <TableRow key={log.id || row.id} className="border-b border-border/50 hover:bg-accent/5">
            <TableCell className="text-center py-[.75rem]">
              {formatDate(log.date)}
            </TableCell>
            <TableCell className="text-center py-[.75rem]">
              <LogLevelBadge level={log.logLevel} />
            </TableCell>
            <TableCell className="text-center py-[.75rem]">
              <span className="truncate block max-w-[400px] mx-auto">
                {log.message}
              </span>
            </TableCell>
            <TableCell className="text-center py-[.75rem]">
              {log.hour}
            </TableCell>
            <TableCell className="text-center py-[.75rem]">
              {log.type}
            </TableCell>
          </TableRow>
        )
      })}
    </>
  )
}