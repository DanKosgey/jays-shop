import { NextResponse } from 'next/server';

// Standardized error response format
export function createErrorResponse(message: string, status: number = 500, details?: any) {
  const errorResponse = {
    error: message,
    ...(details && { details })
  };
  
  return NextResponse.json(errorResponse, { status });
}

// Standardized success response format
export function createSuccessResponse(data: any, status: number = 200) {
  return NextResponse.json(data, { status });
}