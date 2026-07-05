type LogLevel = "debug" | "info" | "warn" | "error";

type StructuredLog = {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
};

const logBuffer: StructuredLog[] = [];

function emit(log: StructuredLog): void {
  logBuffer.push(log);
  const line = JSON.stringify(log);
  if (log.level === "error") {
    console.error(line);
  } else if (process.env.NODE_ENV !== "production") {
    console.info(line);
  }
}

/** Logger estruturado — base para Datadog/Prometheus via sidecar ou agent. */
export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    emit({ level: "debug", message, timestamp: new Date().toISOString(), context });
  },
  info(message: string, context?: Record<string, unknown>) {
    emit({ level: "info", message, timestamp: new Date().toISOString(), context });
  },
  warn(message: string, context?: Record<string, unknown>) {
    emit({ level: "warn", message, timestamp: new Date().toISOString(), context });
  },
  error(message: string, context?: Record<string, unknown>) {
    emit({ level: "error", message, timestamp: new Date().toISOString(), context });
  },
};

export type ErrorContext = {
  userId?: string;
  tenantId?: string;
  route?: string;
  tags?: Record<string, string>;
};

/**
 * Captura exceção para Sentry (ou mock em dev).
 * Configure SENTRY_DSN no ambiente para ativar o SDK em produção.
 */
export function captureException(error: unknown, context?: ErrorContext): void {
  const message = error instanceof Error ? error.message : String(error);
  logger.error(message, {
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });

  const dsn = process.env.SENTRY_DSN ?? process.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  // Placeholder: Sentry.captureException(error, { extra: context })
}

/** Métrica de contador simples — exportável para Prometheus pushgateway. */
export function incrementMetric(name: string, labels?: Record<string, string>): void {
  logger.info("metric", { name, labels, type: "counter", value: 1 });
}

export function getRecentLogs(limit = 50): StructuredLog[] {
  return logBuffer.slice(-limit);
}

export function clearLogBuffer(): void {
  logBuffer.length = 0;
}
