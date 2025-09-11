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
      return NextResponse.json(
        {
          message: errorData?.message || 'Lỗi đăng ký',
          statusCode: response.status,
          error: errorData?.error || 'REGISTRATION_ERROR'
        },
        { status: response.status || 400 }
      );
    }

    const data = await response.json();
    
    // Set HTTP-only cookies for tokens
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    };

    const responseHeaders = new Headers();
    
    // Set access token cookie
    responseHeaders.append(
      'Set-Cookie',
      `accessToken=${data.auth.access_token}; ${Object.entries(cookieOptions)
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    );
    
    // Set refresh token cookie
    responseHeaders.append(
      'Set-Cookie',
      `refreshToken=${data.auth.refresh_token}; ${Object.entries({
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 30, // 30 days for refresh token
      })
        .map(([key, value]) => `${key}=${value}`)
        .join('; ')}`
    );

    return NextResponse.json(
      {
        message: 'Đăng ký thành công',
        user: data.user,
        auth: data.auth
      },
      { headers: responseHeaders }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        message: err.message || 'Lỗi đăng ký',
        error: 'NETWORK_ERROR'
      },
      { status: 500 }
    );
  }
}
