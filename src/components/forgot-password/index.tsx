"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import bannerContact from "@public/images/home/banner-contact.jpg"; // Ensure this path is correct
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email hoặc tên đăng nhập"),
});

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: any) => {
    console.log("Đăng nhập dữ liệu:", data);
  };

  return (
    <section className="relative min-h-screen grid grid-cols-1">
      <div className="absolute z-[1] inset-0 top-0 left-0 w-full">
        <Image
          src={bannerContact}
          alt="Support Form"
          fill
          className="w-full h-auto object-cover"
          priority
        />
      </div>
      <div className="relative container z-10 flex items-center justify-center">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full max-w-[600px] bg-white rounded-2xl shadow p-8 space-y-6"
        >
          <h1 className="text-2xl font-bold text-black">Quên mật khẩu</h1>

          <div>
            <label className="block text-sm font-medium mb-1">Email/ Tên Đăng Nhập</label>
            <Input {...register("email")}
              placeholder="Nhập email hoặc tên đăng nhập"
              className="h-14 text-base"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message?.toString()}</p>}
          </div>
          <Button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 py-7 text-black">
            Quên mật khẩu →
          </Button>

        </form>
      </div>
    </section>
  );
}