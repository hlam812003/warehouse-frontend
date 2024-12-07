'use client'

import { rankItem } from '@tanstack/match-sorter-utils'
import { useQueryErrorResetBoundary } from '@tanstack/react-query'
import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  PaginationState,
  ColumnDef,
  FilterFn,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState
} from '@tanstack/react-table'
import { ArrowUpDown, CirclePlus, ArrowUpAZ, ArrowDownAZ, Filter, Search, Pencil, Trash } from 'lucide-react'
import React, { useState, useEffect, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Loader } from '@/components/ui/loader'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { useDeleteCompany, useGetCompanyList } from '@/hooks/company'
import { useDebounce } from '@/hooks/useDebounce'
import { useDialog } from '@/hooks/useDialog'
import { cn } from '@/lib/utils'
import { CompanyInfo } from '@/types'

import CompaniesDataLoading from './companies-data-loading'
import { CompanyCreate } from './company-create'
import { CompanyUpdate } from './company-update'

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(row.getValue(columnId), value)
  addMeta({ itemRank })
  return itemRank.passed
}

interface NoMatchingMessageProps {
  value: string
}

const NoMatchingMessage: React.FC<NoMatchingMessageProps> = ({ value }) => (
  <div className="px-2 py-2 text-sm text-muted-foreground">
    <div className="flex flex-col items-center gap-1">
      <span>
        No items found matching &quot;<span className="font-medium">{value}</span>&quot;
      </span>
      <span className="text-xs">
        Try adjusting your search to find what you&apos;re looking for.
      </span>
    </div>
  </div>
)

export default function CompanyTable() {
  const { reset } = useQueryErrorResetBoundary()
  const { closeDialog, dialogsOpen, setDialogsOpen } = useDialog({
    add: false,
    edit: false,
    delete: false
  })

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5
  })

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<{ [key: string]: string }>({})
  const [sortConfig, setSortConfig] = useState<{ [key: string]: 'asc' | 'desc' | null }>({
    companyName: null
  })
  const [totalElements, setTotalElements] = useState<number>(0)
  const [searchValue, setSearchValue] = useState<string>('')
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [totalPages, setTotalPages] = useState<number>(0)

  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null)
  const [deletingCompany, setDeletingCompany] = useState<CompanyInfo | null>(null)

  const { data: companies, isLoading, refetch } = useGetCompanyList()
  const deleteCompanyMutation = useDeleteCompany()

  const handleEdit = (company: CompanyInfo) => {
    if (company.companyId) {
      setEditingCompanyId(company.companyId)
      setDialogsOpen(prev => ({ ...prev, edit: true }))
    }
  }

  const handleDelete = (company: CompanyInfo) => {
    setDeletingCompany(company)
    setDialogsOpen(prev => ({ ...prev, delete: true }))
  }

  const confirmDelete = async () => {
    if (deletingCompany?.companyId) {
      await deleteCompanyMutation.mutateAsync(deletingCompany.companyId)
      setDialogsOpen(prev => ({ ...prev, delete: false }))
      refetch()
    }
  }

  const [data, setData] = useState<CompanyInfo[]>([])

  const handleSort = (columnId: string) => {
    setSortConfig(prev => {
      const newConfig = { ...prev }
      if (newConfig[columnId] === null || newConfig[columnId] === undefined) {
        newConfig[columnId] = 'asc'
      } else if (newConfig[columnId] === 'asc') {
        newConfig[columnId] = 'desc'
      } else {
        newConfig[columnId] = null
      }
      return newConfig
    })

    setSorting(prev => {
      if (prev[0]?.id === columnId) {
        if (prev[0]?.desc) {
          return []
        }
        return [{ id: columnId, desc: true }]
      }
      return [{ id: columnId, desc: false }]
    })
  }

  const handleFilter = (columnId: string, value: string) => {
    setColumnFilters(prev => {
      const newFilters = { ...prev }
      if (newFilters[columnId] === value) {
        delete newFilters[columnId]
      } else {
        newFilters[columnId] = value
      }
      return newFilters
    })
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)
    setIsSearching(true)
  }

  useEffect(() => {
    if (companies?.companyList) {
      let filteredData = [...companies.companyList]

      // Apply column filters
      Object.entries(columnFilters).forEach(([columnId, filterValue]) => {
        if (filterValue) {
          filteredData = filteredData.filter(item => {
            const value = String(item[columnId as keyof CompanyInfo] || '').toLowerCase()
            return value.includes(filterValue.toLowerCase())
          })
        }
      })

      // Apply search filter
      if (debouncedSearchValue) {
        filteredData = filteredData.filter(company => {
          const matchesName = company.companyName?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          const matchesId = company.companyId?.toLowerCase().includes(debouncedSearchValue.toLowerCase())
          return matchesName || matchesId
        })
      }

      setData(filteredData)
      setTotalElements(filteredData.length)
      setTotalPages(Math.ceil(filteredData.length / pagination.pageSize))
      setIsSearching(false)
    }
  }, [companies, columnFilters, debouncedSearchValue, pagination.pageSize])

  const columns = useMemo<ColumnDef<CompanyInfo>[]>(() => [
    {
      accessorKey: 'companyId',
      header: 'Company ID',
      filterFn: fuzzyFilter
    },
    {
      accessorKey: 'companyName',
      header: 'Name',
      filterFn: fuzzyFilter
    },
    {
      accessorKey: 'phoneContact',
      header: 'Phone Contact',
      filterFn: fuzzyFilter
    }
  ], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
      sorting,
      globalFilter: debouncedSearchValue
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    filterFns: {
      fuzzy: fuzzyFilter
    }
  })

  return (
    <section className="w-full mt-[1.5rem]">
      <div className="flex items-center justify-between w-full mb-[.85rem]">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Input
              placeholder="Search companies..."
              className="min-w-[20rem]"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader color="#fff" size="1.15rem" />
              </div>
            )}
          </div>
        </div>
        <Dialog open={dialogsOpen.add} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, add: open }))}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-black text-white hover:bg-black hover:text-white dark:bg-primary/10 dark:text-primary">
              <CirclePlus className="mr-2 h-4 w-4" />
              <span>Add Company</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[30rem]">
            <DialogHeader>
              <DialogTitle>Create Company</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new company.
              </DialogDescription>
            </DialogHeader>
            <CompanyCreate onClose={() => closeDialog('add')} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  Company ID
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Filter className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[16rem]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727]" />
                      <div className="px-2 py-2">
                        <div className="relative">
                          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4' />
                          <Input
                            placeholder="Search by ID..."
                            className="flex-grow pl-8 pr-2.5"
                            value={columnFilters['companyId'] || ''}
                            onChange={(e) => handleFilter('companyId', e.target.value)}
                          />
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727]" />
                      <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
                        {!data.length && <NoMatchingMessage value={columnFilters['companyId']} />}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Name
                  {sortConfig.companyName === 'asc' ? (
                    <ArrowUpAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('companyName')} />
                  ) : sortConfig.companyName === 'desc' ? (
                    <ArrowDownAZ className="h-4 w-4 cursor-pointer" onClick={() => handleSort('companyName')} />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 cursor-pointer" onClick={() => handleSort('companyName')} />
                  )}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Phone Contact
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Filter className="h-4 w-4 cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="min-w-[16rem]">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727]" />
                      <div className="px-2 py-2">
                        <div className="relative">
                          <Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4' />
                          <Input
                            placeholder="Search phone..."
                            className="flex-grow pl-8 pr-2.5"
                            value={columnFilters['phoneContact'] || ''}
                            onChange={(e) => handleFilter('phoneContact', e.target.value)}
                          />
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-gray-200 dark:bg-[#272727]" />
                      <DropdownMenuGroup className="max-h-[200px] overflow-y-auto">
                        {!data.length && <NoMatchingMessage value={columnFilters['phoneContact']} />}
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <CompaniesDataLoading />
            ) : table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-muted-foreground text-center">
                  {debouncedSearchValue ? (
                    <div className="flex flex-col items-center gap-1">
                      <span>
                        No companies found matching &quot;<span className="font-medium">{debouncedSearchValue}</span>&quot;
                      </span>
                      <span className="text-sm">
                        Try adjusting your search to find what you&apos;re looking for.
                      </span>
                    </div>
                  ) : (
                    'No companies available.'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              <ErrorBoundary
                onReset={reset}
                fallbackRender={({ resetErrorBoundary }) => (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span>There was an error loading the companies data.</span>
                        <Button
                          onClick={() => resetErrorBoundary()}
                          variant="outline"
                          className="bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary"
                        >
                          Try again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              >
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.original.companyId}>
                    <TableCell className="py-3">{row.original.companyId}</TableCell>
                    <TableCell className="py-3">{row.original.companyName}</TableCell>
                    <TableCell className="py-3">{row.original.phoneContact}</TableCell>
                    <TableCell className="text-right py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(row.original)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleDelete(row.original)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </ErrorBoundary>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </span>
          <span className="text-sm text-muted-foreground">
            | Total: {data.length} {data.length > 1 ? 'companies' : 'company'}
          </span>
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className={cn(
                  !table.getCanPreviousPage() && 'pointer-events-none opacity-50',
                  'hover:bg-black hover:text-white dark:hover:bg-primary/10 dark:hover:text-primary'
                )}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => table.nextPage()}
                className={cn(
                  !table.getCanNextPage() && 'pointer-events-none opacity-50',
                  'hover:bg-black hover:text-white dark:hover:bg-primary/10 dark:hover:text-primary'
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogsOpen.edit} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, edit: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
          </DialogHeader>
          {editingCompanyId && (
            <CompanyUpdate
              companyId={editingCompanyId}
              onSuccess={() => {
                refetch()
                setDialogsOpen(prev => ({ ...prev, edit: false }))
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={dialogsOpen.delete} onOpenChange={(open) => setDialogsOpen(prev => ({ ...prev, delete: open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Company</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {deletingCompany?.companyName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className={cn('bg-accent')}
              type="button"
              variant="outline"
              onClick={() => closeDialog('delete')}
            >
              Cancel
            </Button>
            <Button
              className={cn(
                'bg-black text-white hover:bg-black dark:bg-primary/10 dark:text-primary',
                deleteCompanyMutation.isPending && 'flex items-center gap-3 cursor-not-allowed pointer-events-none'
              )}
              onClick={confirmDelete}
            >
              {deleteCompanyMutation.isPending ? (
                <>
                  Deleting...
                  <Loader color="#62c5ff" size="1.25rem" />
                </>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}