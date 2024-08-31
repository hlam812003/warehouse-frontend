import { z } from 'zod'

import { loginSchema } from '../config/ZodSchema'

export type Navbar = {
  name: string
  href: string
}

export type LoginFormData = z.infer<typeof loginSchema>