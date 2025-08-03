"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import bannerContact from "@public/images/home/banner-contact.jpg"; // Ensure this path is correct
import { login } from "@services/client.service";
import { Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email hoặc tên đăng nhập"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Đăng nhập thành công!')
      window.location.href = '/'
    } catch (error: any) {
      toast.error(error?.message)
    } finally {
      setIsLoading(false)
    }
  };

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[600px] bg-white rounded-2xl shadow p-8 space-y-6"
        >
          <h1 className="text-2xl font-bold text-black">Đăng nhập ngay!</h1>

          <div>
            <label className="block text-sm font-medium mb-1">Email/ Tên Đăng Nhập</label>
            <Input {...register("email")}
              placeholder="Nhập email hoặc tên đăng nhập"
              className="h-14 text-base"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message?.toString()}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mật Khẩu</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="Nhập mật khẩu"
                className="h-14 text-base"
              />
              <Eye
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 cursor-pointer text-muted-foreground"
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message?.toString()}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="remember" />
              <label htmlFor="remember" className="text-sm text-muted-foreground">
                Lưu thông tin
              </label>
            </div>
            <a href="/forgot-password" className="text-sm text-primary hover:underline">Quên mật khẩu?</a>
          </div>

          <Button type="submit" className={`w-full bg-yellow-400 hover:bg-yellow-500 py-7 text-black ${isLoading ? 'pointer-events-none': ''}`}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
              </>
            ) : (
              'Đăng nhập →'
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản? <a href="/register" className="text-black font-semibold hover:underline">Đăng ký tài khoản</a>
          </p>
        </form>
      </div>
    </section>
  );
}