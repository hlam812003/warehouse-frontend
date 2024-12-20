import { useQuery } from '@tanstack/react-query'

import { API_ENDPOINTS } from '@/constants'

const getCompanyDetail = async (companyId: string) => {
  const response = await fetch(`${API_ENDPOINTS.GET_COMPANY_DETAIL}?id=${companyId}`, {
    credentials: 'include'
  })

  if (!response.ok) {
    throw new Error('Failed to fetch company detail')
  }

  const responseData = await response.json()
  return responseData
}

export const useGetCompanyDetail = (companyId: string) => {
  return useQuery({
    queryKey: ['company', companyId],
    queryFn: () => getCompanyDetail(companyId)
  })
}