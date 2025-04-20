import { NextResponse } from 'next/server';
import { initTracing } from './src/lib/telemetry';

// Initialize tracing once on module load
initTracing();

export function middleware(req) {
  return NextResponse.next();
}
