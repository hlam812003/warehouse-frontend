import { NextRequest, NextResponse } from 'next/server'

import { CompaniesClient } from '@/app/api/web-api-client'
import { cookieStore } from '@/lib/auth'

export async function DELETE(
  request: NextRequest
) {
  try {
    // Get authentication token
    const token = cookieStore.get('auth_token')

    if (!token) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Khởi tạo CompaniesClient với token
    const client = new CompaniesClient(
      process.env.NEXT_PUBLIC_BACKEND_API_URL,
      undefined,
      token,
      undefined
    )

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id') || ''
    // Gọi API để xóa company
    await client.deleteCompany(id)

    // Trả về kết quả thành công
    return NextResponse.json({ message: 'Company deleted successfully' }, { status: 200 })
  } catch (error) {
    return new NextResponse(
      JSON.stringify({
        message: 'Error deleting company',
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}
