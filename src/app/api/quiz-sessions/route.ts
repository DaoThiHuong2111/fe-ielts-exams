import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8228';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get('cookie');

    const response = await axios.post(`${BACKEND_API_URL}/v1/quiz-sessions`, body, {
      headers: {
        'Authorization': `Bearer ${cookieHeader?.split('accessToken=')[1]?.split(';')[0]}`,
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Failed to create quiz session:', error);
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || 'Failed to create quiz session' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.toString();
    const cookieHeader = request.headers.get('cookie');

    const response = await axios.get(`${BACKEND_API_URL}/v1/quiz-sessions${query ? `?${query}` : ''}`, {
      headers: {
        'Authorization': `Bearer ${cookieHeader?.split('accessToken=')[1]?.split(';')[0]}`,
        'Content-Type': 'application/json',
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || error.message || 'Failed to fetch quiz sessions' },
      { status: error.response?.status || 500 }
    );
  }
}