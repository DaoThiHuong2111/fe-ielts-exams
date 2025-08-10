// app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  try {
    // Nếu backend có route /auth/logout để thu hồi refresh token:
    if (accessToken) {
      await fetch(`${process.env.BACKEND_API_URL}/v1/auth/signOut`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }
  } catch (err) {
    // Không sao nếu logout trên backend thất bại — vẫn tiếp tục xóa cookie
    console.warn('Gọi logout backend thất bại:', err);
  }

  // Xóa cookie token khỏi trình duyệt
  cookieStore.delete('accessToken');
  cookieStore.delete('refreshToken');

  return NextResponse.json({ message: 'Đăng xuất thành công' });
}
