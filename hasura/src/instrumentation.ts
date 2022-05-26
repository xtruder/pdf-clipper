import { NodeSDK, tracing } from "@opentelemetry/sdk-node";
import { NodeTracerProvider } from "@opentelemetry/sdk-trace-node";
import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";

import { traceExporterName } from "./config";

// For troubleshooting, set the log level to DiagLogLevel.DEBUG
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

export async function startInstrumentation() {
  let traceExporter: tracing.SpanExporter | undefined;

  switch (traceExporterName) {
    case "noop":
      break;
    case "console":
      traceExporter = new tracing.ConsoleSpanExporter();
      break;
    default:
      throw new Error("invalid trace exporter name: " + traceExporterName);
  }

  const provider = new NodeTracerProvider();
  provider.register();

  const sdk = new NodeSDK({
    traceExporter,
    instrumentations: [
      getNodeAutoInstrumentations({
        "@opentelemetry/instrumentation-http": {},
        "@opentelemetry/instrumentation-express": {},
        "@opentelemetry/instrumentation-winston": {},
      }),
    ],
  });

  await sdk.start();

  console.log("instrumentation started");

  return sdk;
}
