import { startInstrumentation } from "./instrumentation";
import { startServer } from "./server";

async function main() {
  await startInstrumentation();
  await startServer();
}

main();
