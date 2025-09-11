import { NextRequest, NextResponse } from 'next/server';
import { clientService } from '@/lib/axios';

/**
 * GET /api/user/profile - Get user profile
 */
export async function GET(request: NextRequest) {
  try {
    const response = await clientService.get('/v1/user/profile', {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Get profile error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'Lấy thông tin người dùng thất bại',
        errors: error.response?.data?.errors 
      },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * PUT /api/user/profile - Update user profile
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await clientService.put('/v1/user/profile', body, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Update profile error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'Cập nhật thông tin thất bại',
        errors: error.response?.data?.errors 
      },
      { status: error.response?.status || 500 }
    );
  }
}