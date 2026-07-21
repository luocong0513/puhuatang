import { NextResponse } from 'next/server';

/**
 * GET /api/chat/token
 * 为 Coze Web SDK 提供 API Token
 * SDK 会通过 refreshToken 回调请求此接口获取认证凭证
 */
export async function GET() {
  const token = process.env.COZE_WORKLOAD_API_TOKEN || '';

  if (!token) {
    return NextResponse.json(
      { error: 'Token not configured' },
      { status: 500 }
    );
  }

  return NextResponse.json({ token });
}
