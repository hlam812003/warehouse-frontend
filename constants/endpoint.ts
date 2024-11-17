export const API_ENDPOINTS = {
  CREATE_USER: '/api/dashboard/superadmin/users/create',
  UPDATE_USER: '/api/dashboard/superadmin/users/update',
  DELETE_USER: '/api/dashboard/superadmin/users/delete',
  GET_ALL_USERS: '/api/dashboard/superadmin/users/list',
  GET_USER_DETAIL: '/api/dashboard/superadmin/users/detail',
  GET_ALL_LOGS: '/api/dashboard/superadmin/logs',
  GET_ALL_COMPANIES: '/api/dashboard/superadmin/companies/list',
  GET_ALL_EMPLOYEES: '/api/dashboard/admin/employees/list',  
  GET_EMPLOYEE_DETAIL: '/api/dashboard/admin/employees/detail',
  CREATE_EMPLOYEE: '/api/dashboard/admin/employees/create', 
  UPDATE_EMPLOYEE: '/api/dashboard/admin/employees/update',
  DELETE_EMPLOYEE: '/api/dashboard/admin/employees/delete', 
  GET_STORAGE_OF_USER: '/api/dashboard/admin/storages/listofuser', 
  GET_CONFIG: '/api/dashboard/superadmin/settings/get',
  CREATE_CONFIG: '/api/dashboard/superadmin/settings/create',
  CREATE_STORAGE: '/api/dashboard/admin/storages/create',   
  GET_ALL_STATS: '/api/dashboard/superadmin/stats'
} as const

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS]