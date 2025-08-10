// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(`${process.env.BACKEND_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Lỗi đăng ký');
    }

    return NextResponse.json({ message: 'Đăng ký thành công' });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Lỗi đăng ký' }, { status: 400 });
  }
}
