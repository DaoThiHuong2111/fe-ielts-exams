'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import bannerContact from "@public/images/home/banner-contact.jpg"; // Ensure this path is correct
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z
  .object({
    fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
    email: z.string().email('Email không hợp lệ'),
    phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
    password: z.string().min(6, 'Mật khẩu tối thiểu 6 ký tự'),
    confirmPassword: z.string().min(6, 'Vui lòng nhập lại mật khẩu'),
    acceptPolicy: z.literal(true, {
      errorMap: () => ({ message: 'Bạn cần đồng ý với chính sách bảo mật' })
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu nhập lại không khớp',
    path: ['confirmPassword']
  })

type FormData = z.infer<typeof formSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur'
  })

  const onSubmit = (data: FormData) => {
    console.log('Register data:', data)
  }

  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="absolute z-[1] inset-0 top-0 left-0 w-full">
        <Image
          src={bannerContact}
          alt="Support Form"
          fill
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      <div className="hidden md:block"></div>
      <div className="relative container z-10 flex items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[600px] bg-white rounded-2xl shadow p-8 space-y-6">
          <h2 className="text-3xl font-bold mb-8">Tạo tài khoản</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Họ và tên của bạn</label>
            <input
              type="text"
              {...register('fullName')}
              className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nhập họ và tên của bạn"
            />
            {errors.fullName && (
              <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                {...register('email')}
                className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Nhập email của bạn"
              />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Số điện thoại</label>
              <input
                type="text"
                {...register('phone')}
                className="w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Nhập số điện thoại của bạn"
              />
              {errors.phone && (
                <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className="w-full rounded-lg border px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nhập mật khẩu của bạn"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1">Nhập lại mật khẩu</label>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              {...register('confirmPassword')}
              className="w-full rounded-lg border px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Nhập lại mật khẩu của bạn"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register('acceptPolicy')}
              className="mr-2"
            />
            <label className="text-sm">
              Đồng ý với các <span className="font-semibold">Chính sách bảo mật</span>
            </label>
          </div>
          {errors.acceptPolicy && (
            <p className="text-sm text-red-500">{errors.acceptPolicy.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 transition-colors py-4 rounded-xl text-base font-medium"
          >
            Đăng ký →
          </button>

          <p className="text-center text-sm pt-2">
            Đã có tài khoản? <a href="/login" className="text-blue-600 font-semibold">Đăng nhập ngay</a>
          </p>
        </form>
      </div>
    </section>
  )
}
