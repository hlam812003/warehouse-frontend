import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, TriangleAlert } from 'lucide-react'
// import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { BorderBeam } from '@/components/magicui/border-beam'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader } from '@/components/ui/loader'
import { loginSchema } from '@/configs/zod-schema'
// import { useToast } from '@/hooks/useToast'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { LoginFormData } from '@/types'

export function LoginForm() {
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // const router = useRouter()
  const { clearExpiredMessage, checkAuth } = useAuth()
  // const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginFormData) => {
    setError('')
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      const result = await response.json()

      if (response.ok) {
        clearExpiredMessage()
        await checkAuth()

        toast.success('Login successful', {
          description: 'Redirecting to dashboard...',
          duration: 3000
        })
        // router.push('/dashboard')
        window.location.href = '/dashboard'
      } else {
        setError(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      reset({ password: '' })
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-7 shadow-input bg-transparent backdrop-filter backdrop-blur-lg bg-opacity-30 border border-gray-200 dark:border-gray-800 relative z-10">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome back
      </h2>
      <p className="text-neutral-600 leading-6 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Please enter your login information to continue.
      </p>

      {error && (
        <div className="w-full h-11 flex items-center gap-[.6rem] px-4 rounded-md bg-[#ff000025] mt-4">
          <TriangleAlert className='w-4 h-4 text-red-500' />
          <p className='text-red-500 font-medium text-sm'>
            {error}
          </p>
        </div>
      )}

      <form className='mt-8' onSubmit={handleSubmit(onSubmit)}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="user@example.com"
            type="email"
            {...register('email')}
            autoComplete="off"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              placeholder="••••••••"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              autoComplete="current-password"
              className='pr-[2.8rem]'
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-[1.25rem] flex items-center text-sm leading-5"
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-[#fff]" /> : <Eye className="h-4 w-4 text-[#fff]" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </LabelInputContainer>
        <button
          className={cn(
            'bg-gradient-to-br mt-6 relative flex items-center gap-4 justify-center group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-[.95rem] text-white rounded-md h-11 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]',
            isSubmitting && 'cursor-not-allowed'
          )}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader size='1.35rem' />
          ) : (
            'Login'
          )}
          <BottomGradient />
        </button>
      </form>
      <BorderBeam size={120} duration={12} delay={9} />
    </div>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  )
}

const LabelInputContainer = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn('flex flex-col space-y-2 w-full', className)}>
      {children}
    </div>
  )
}