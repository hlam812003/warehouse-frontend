export const API_ENDPOINTS = {
  CREATE_USER: '/api/dashboard/superadmin/users/create',
  UPDATE_USER: '/api/dashboard/superadmin/users/update',
  DELETE_USER: '/api/dashboard/superadmin/users/delete',
  GET_ALL_USERS: '/api/dashboard/superadmin/users/list',
  GET_USER_DETAIL: '/api/dashboard/superadmin/users/detail',
  GET_ALL_LOGS: '/api/dashboard/superadmin/logs',
  GET_ALL_COMPANIES: '/api/dashboard/superadmin/companies/list',
  GET_CONFIG: '/api/dashboard/superadmin/settings/get',
  CREATE_CONFIG: '/api/dashboard/superadmin/settings/create',
  GET_ALL_SUPER_ADMIN_STATS: '/api/dashboard/superadmin/stats',
  GET_ALL_ADMIN_STATS: '/api/dashboard/admin/stats',
  GET_COFFEE_PRICE_PREDICT_GRAPH: '/api/dashboard/admin/charts',
  GET_ALL_EMPLOYEES: '/api/dashboard/admin/employees/list',
  GET_EMPLOYEE_DETAIL: '/api/dashboard/admin/employees/detail',
  CREATE_EMPLOYEE: '/api/dashboard/admin/employees/create',
  UPDATE_EMPLOYEE: '/api/dashboard/admin/employees/update',
  DELETE_EMPLOYEE: '/api/dashboard/admin/employees/delete',
  GET_STORAGE_OF_USER: '/api/dashboard/admin/storages/listOfUser',
  CREATE_STORAGE: '/api/dashboard/admin/storages/create'
} as const

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]