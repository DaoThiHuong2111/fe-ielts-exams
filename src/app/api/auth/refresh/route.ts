// app/api/auth/refresh/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;
    
    if (!refreshToken) {
      return NextResponse.json({ message: 'Không có refresh token' }, { status: 401 });
    }
    
    const response = await fetch(`${process.env.BACKEND_API_URL}/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      cookieStore.delete('refreshToken');
      cookieStore.delete('accessToken');
      const errorData = await response.json();
      throw new Error(errorData?.message || 'Refresh thất bại');
    }

    const resData = await response.json();
    const { access_token, refresh_token } = resData?.data;

    cookieStore.set('accessToken', access_token, {
      // httpOnly: true,
      path: '/',
      maxAge: 60 * 15,
    });
    cookieStore.set('refreshToken', refresh_token, {
      // httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
    return NextResponse.json({ message: 'Refreshed', accessToken: access_token });
  } catch (err: any) {
    return NextResponse.json({ message: err.message || 'Refresh thất bại' }, { status: 401 });
  }
}