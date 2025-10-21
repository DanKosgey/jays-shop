import { z } from 'zod';

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  GENKIT_GOOGLE_API_KEY: z.string().min(1).optional(),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type AppEnv = z.infer<typeof EnvSchema>;

let cachedEnv: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cachedEnv) return cachedEnv;
  
  // Log environment variables for debugging
  console.log('Environment variables:', {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '***' : undefined,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? '***' : undefined,
    NODE_ENV: process.env.NODE_ENV,
  });
  
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join(', ');
    console.warn(`Invalid environment variables: ${issues}`);
    // Return a minimal environment object instead of throwing
    return {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
      SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key',
      NODE_ENV: (process.env.NODE_ENV as 'development' | 'test' | 'production') || 'development',
    };
  }
  cachedEnv = parsed.data;
  return cachedEnv;
}