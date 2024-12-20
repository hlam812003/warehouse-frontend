'use client'

import { format } from 'date-fns'
import { DollarSign, Package, ShoppingCart } from 'lucide-react'
import { CalendarIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { DateRange } from 'react-day-picker'

import { ReportVM, WarehousePerformance, ImportSummary, ProductPerformance } from '@/app/api/web-api-client'
import NumberTicker from '@/components/magicui/number-ticker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { TransitionPanel } from '@/components/ui/transition-panel'
import { useReportStorage } from '@/hooks/report'
import { cn } from '@/lib/utils'

import { ImportStatistics } from './import-statistics'
import { ProductComparison } from './product-comparison'
import { WarehouseStatistics } from './warehouse-statistics'

const TABS = [
  { id: 0, label: 'Warehouse Statistics' },
  { id: 1, label: 'Import Statistics' },
  { id: 2, label: 'Product Comparison' }
] as const

export default function ReportStorages() {
  const [startDate, setStartDate] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const [endDate, setEndDate] = useState<Date>(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth() + 1, 0)
  })

  const [activeTab, setActiveTab] = useState(0)

  const { data }: { data: ReportVM } = useReportStorage(startDate, endDate)
  const [warehouseStatistics, setWarehouseStatistics] = useState<WarehousePerformance[]>([])
  const [importStatistics, setImportStatistics] = useState<ImportSummary[]>([])
  const [topProducts, setTopProducts] = useState<ProductPerformance[]>([])
  const [slowMovingProducts, setSlowMovingProducts] = useState<ProductPerformance[]>([])

  useEffect(() => {
    if (data) {
      setWarehouseStatistics(data.warehouseStatistics ?? [])
      setImportStatistics(data.importStatistics ?? [])
      setTopProducts(data.topProducts ?? [])
      setSlowMovingProducts(data.slowMovingProducts ?? [])
    }
  }, [data])

  const renderStatCard = (title: string, description: string, value: number, icon: React.ReactNode, delay: number, showCurrency: boolean = true) => (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <div className="flex items-center justify-center w-8 h-8 rounded-full border">
            {icon}
          </div>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          {showCurrency && <span className="text-2xl font-bold">$</span>}
          <NumberTicker
            value={value}
            className="text-2xl font-bold"
            delay={delay}
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <section className="w-full mt-[1.5rem]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        {renderStatCard(
          'Total Sale Cost',
          'Total revenue generated from sales',
          data?.totalRevenue ?? 0,
          <DollarSign className="h-4 w-4 text-muted-foreground" />,
          0
        )}
        {renderStatCard(
          'Total Import Cost',
          'Total cost of imports',
          data?.totalImportCost ?? 0,
          <Package className="h-4 w-4 text-muted-foreground" />,
          0.2
        )}
        {renderStatCard(
          'Total Completed Orders',
          'Total number of orders completed',
          data?.totalOrders ?? 0,
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />,
          0.4,
          false
        )}
      </div>

      <div className="max-w-[20rem] mb-5 flex gap-4">
        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">From</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[200px] justify-start text-left font-normal'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(startDate, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => date && setStartDate(date)}
                initialFocus
                disabled={(date) => date > endDate}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm font-medium">To</p>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-[200px] justify-start text-left font-normal'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(endDate, 'dd/MM/yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={(date) => date && setEndDate(date)}
                initialFocus
                disabled={(date) => date < startDate}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="inline-flex h-9 items-center w-full p-1 text-muted-foreground mb-5 gap-x-3">
        {TABS.map((tab) => (
          <Button
            key={tab.id}
            className={cn(
              'w-1/3 px-3 bg-transparent hover:bg-black hover:text-white hover:dark:bg-primary/10 hover:dark:text-primary text-muted-foreground',
              activeTab === tab.id && 'bg-black text-white dark:bg-primary/10 dark:text-primary'
            )}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      <TransitionPanel
        activeIndex={activeTab}
        transition={{ duration: 0.3 }}
        variants={{
          enter: { opacity: 0, x: 20 },
          center: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 }
        }}
      >
        {[
          <div key="warehouse" className="space-y-6">
            <WarehouseStatistics data={warehouseStatistics} />
          </div>,
          <div key="import" className="space-y-6">
            <ImportStatistics data={importStatistics} />
          </div>,
          <div key="products" className="space-y-6">
            <ProductComparison topProducts={topProducts} slowMovingProducts={slowMovingProducts} />
          </div>
        ]}
      </TransitionPanel>
    </section>
  )
}