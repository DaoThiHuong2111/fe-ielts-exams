import { NextRequest, NextResponse } from 'next/server';
import { clientService } from '@/lib/axios';

/**
 * POST /api/user/avatar - Upload user avatar
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const response = await clientService.post('/v1/user/avatar', formData, {
      headers: {
        Cookie: request.headers.get('cookie') || '',
        'Content-Type': 'multipart/form-data',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Upload avatar error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'Tải lên ảnh đại diện thất bại',
        errors: error.response?.data?.errors 
      },
      { status: error.response?.status || 500 }
    );
  }
}

/**
 * DELETE /api/user/avatar - Delete user avatar
 */
export async function DELETE(request: NextRequest) {
  try {
    const response = await clientService.delete('/v1/user/avatar', {
      headers: {
        Cookie: request.headers.get('cookie') || '',
      },
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Delete avatar error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: error.response?.data?.message || 'Xóa ảnh đại diện thất bại',
        errors: error.response?.data?.errors 
      },
      { status: error.response?.status || 500 }
    );
  }
}