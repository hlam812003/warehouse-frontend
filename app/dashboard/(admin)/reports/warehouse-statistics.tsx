import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface WarehouseStatistic {
  id: number
  warehouseName: string
  revenue: string
}

interface WarehouseStatisticsProps {
  data: WarehouseStatistic[]
}

export function WarehouseStatistics({ data = [] }: WarehouseStatisticsProps) {
  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(value))
  }

  const truncateValue = (value: string, maxLength: number = 8) => {
    return value.length > maxLength ? value.slice(0, 4) + '...' : value
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Warehouse Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Warehouse Name</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          {data.length > 0 ? (
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.warehouseName}</TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <TableCell className={`text-right ${parseFloat(item.revenue) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {truncateValue(formatCurrency(item.revenue))}
                        </TableCell>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{formatCurrency(item.revenue)}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} className="text-center">No data available</TableCell>
              </TableRow>
            </TableBody>
          )}
        </Table>
      </CardContent>
    </Card>
  )
}
