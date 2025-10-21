// Admin logging utility for tracking authentication events
import { toast } from "@/hooks/use-toast";

// Log levels
export type LogLevel = 'info' | 'warn' | 'error';

// Log entry structure
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  userId?: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

// Security event types
export type SecurityEventType = 
  | 'failed_login'
  | 'multiple_failed_logins'
  | 'suspicious_activity'
  | 'unauthorized_access';

// Security event structure
export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: string;
  userEmail?: string;
  ip?: string;
  userAgent?: string;
  attempts?: number;
  metadata?: Record<string, any>;
}

// In-memory storage for tracking failed attempts (temporary fallback)
const failedAttempts: Record<string, { count: number; lastAttempt: number }> = {};

// Get client IP (this is a simplified version - in production you might want to get this from headers)
export const getClientIP = (): string => {
  // In a real implementation, you would get this from request headers
  // For client-side, we'll return a placeholder
  return "CLIENT_IP_UNAVAILABLE";
};

// Get user agent
export const getUserAgent = (): string => {
  if (typeof window !== 'undefined') {
    return navigator.userAgent;
  }
  return "SERVER_SIDE";
};

// Create a log entry
export const createLogEntry = (
  level: LogLevel,
  message: string,
  options: {
    userId?: string;
    userEmail?: string;
    ip?: string;
    metadata?: Record<string, any>;
  } = {}
): LogEntry => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    userId: options.userId,
    userEmail: options.userEmail,
    ip: options.ip || getClientIP(),
    userAgent: getUserAgent(),
    metadata: options.metadata,
  };
};

// Log to console and database
export const logToConsole = (entry: LogEntry): void => {
  const logMethod = entry.level === 'error' ? console.error : 
                   entry.level === 'warn' ? console.warn : console.log;
  
  // Add a clear prefix to make logs easier to identify
  logMethod(`[ADMIN_AUTH] ${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}`, {
    userId: entry.userId,
    userEmail: entry.userEmail,
    ip: entry.ip,
    userAgent: entry.userAgent,
    ...entry.metadata
  });
  
  // Save log to database
  saveLogToDatabase(entry);
};

// Log authentication attempt
export const logAuthAttempt = (
  email: string,
  ip?: string
): void => {
  // console.log('[DEBUG] logAuthAttempt called with email:', email);
  const entry = createLogEntry('info', 'Login attempt', {
    userEmail: email,
    ip,
  });
  
  logToConsole(entry);
};

// Log successful authentication
export const logAuthSuccess = (
  userId: string,
  email: string,
  ip?: string
): void => {
  // console.log('[DEBUG] logAuthSuccess called with userId:', userId, 'email:', email);
  const entry = createLogEntry('info', 'Login successful', {
    userId,
    userEmail: email,
    ip,
  });
  
  logToConsole(entry);
  
  // Reset failed attempts counter on successful login
  if (ip) {
    delete failedAttempts[ip];
  }
  if (email) {
    delete failedAttempts[email];
  }
};

// Log authentication failure
export const logAuthFailure = (
  email: string,
  error: string,
  ip?: string
): void => {
  // console.log('[DEBUG] logAuthFailure called with email:', email, 'error:', error);
  const entry = createLogEntry('warn', 'Login failed', {
    userEmail: email,
    ip,
    metadata: { error },
  });
  
  logToConsole(entry);
  
  // Track failed attempts for security monitoring
  trackFailedAttempt(email, ip, error);
};

// Track failed login attempts for security monitoring
export const trackFailedAttempt = (
  email: string,
  ip?: string,
  error?: string
): void => {
  const now = Date.now();
  const threshold = 5 * 60 * 1000; // 5 minutes
  
  // Check and update failed attempts by IP
  if (ip) {
    if (!failedAttempts[ip]) {
      failedAttempts[ip] = { count: 1, lastAttempt: now };
    } else {
      // Reset counter if last attempt was more than threshold ago
      if (now - failedAttempts[ip].lastAttempt > threshold) {
        failedAttempts[ip].count = 1;
      } else {
        failedAttempts[ip].count += 1;
      }
      failedAttempts[ip].lastAttempt = now;
    }
    
    // Log security event if attempts exceed threshold
    if (failedAttempts[ip].count >= 5) {
      logSecurityEvent('multiple_failed_logins', {
        userEmail: email,
        ip,
        attempts: failedAttempts[ip].count,
        metadata: { error }
      });
    }
  }
  
  // Check and update failed attempts by email
  if (email) {
    if (!failedAttempts[email]) {
      failedAttempts[email] = { count: 1, lastAttempt: now };
    } else {
      // Reset counter if last attempt was more than threshold ago
      if (now - failedAttempts[email].lastAttempt > threshold) {
        failedAttempts[email].count = 1;
      } else {
        failedAttempts[email].count += 1;
      }
      failedAttempts[email].lastAttempt = now;
    }
    
    // Log security event if attempts exceed threshold
    if (failedAttempts[email].count >= 5) {
      logSecurityEvent('multiple_failed_logins', {
        userEmail: email,
        ip,
        attempts: failedAttempts[email].count,
        metadata: { error }
      });
    }
  }
};

// Log security events
export const logSecurityEvent = (
  type: SecurityEventType,
  options: {
    userEmail?: string;
    ip?: string;
    userAgent?: string;
    attempts?: number;
    metadata?: Record<string, any>;
  } = {}
): void => {
  const entry = createLogEntry('error', `Security event: ${type}`, {
    userEmail: options.userEmail,
    ip: options.ip,
    metadata: {
      securityEvent: type,
      userAgent: options.userAgent,
      attempts: options.attempts,
      ...options.metadata
    }
  });
  
  logToConsole(entry);
  
  // Show toast notification for security events
  // toast({
  //   title: "Security Alert",
  //   description: `Suspicious activity detected: ${type.replace('_', ' ')}`,
  //   variant: "destructive",
  // });
};

// Log admin dashboard access
export const logDashboardAccess = (
  userId: string,
  email: string
): void => {
  const entry = createLogEntry('info', 'Admin dashboard accessed', {
    userId,
    userEmail: email,
  });
  
  logToConsole(entry);
};

// Log admin dashboard exit
export const logDashboardExit = (
  userId: string,
  email: string
): void => {
  const entry = createLogEntry('info', 'Admin dashboard exited', {
    userId,
    userEmail: email,
  });
  
  logToConsole(entry);
};

// Save log entry to database
export const saveLogToDatabase = async (entry: LogEntry): Promise<void> => {
  try {
    // In a real implementation, this would make an API call to save the log
    // For now, we'll just log that we would save to database
    // console.log('[DEBUG] Would save log to database:', entry);
  } catch (error) {
    console.error('Failed to save log to database:', error);
  }
};