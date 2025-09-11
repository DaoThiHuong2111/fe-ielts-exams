import { NextRequest, NextResponse } from 'next/server';
import { clientService } from '@/lib/axios';

/**
 * POST /api/user/change-password - Change user password
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await clientService.post('/v1/user/change-password', body, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Change password error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'Đổi mật khẩu thất bại',
        errors: error.response?.data?.errors 
      },
      { status: error.response?.status || 500 }
    );
  }
}