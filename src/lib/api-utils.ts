/**
 * API 工具函数
 */

import { NextResponse } from 'next/server';

/**
 * 统一成功响应
 */
export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

/**
 * 统一错误响应
 */
export function apiError(message: string, status = 400, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status }
  );
}

/**
 * 数据库不可用时的优雅降级响应
 */
export function dbNotConfigured() {
  return NextResponse.json(
    {
      success: false,
      error: 'database_not_configured',
      message: '数据库尚未配置。请设置 DATABASE_URL 环境变量后重试。',
    },
    { status: 503 }
  );
}
