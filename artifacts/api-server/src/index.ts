import app from "./app";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];
const port = rawPort ? Number(rawPort) : 8080;

if (Number.isNaN(port) || port <= 0) {
  logger.error({ rawPort }, "Invalid PORT value, defaulting to 8080");
}

const resolvedPort = Number.isNaN(port) || port <= 0 ? 8080 : port;

app.listen(resolvedPort, "0.0.0.0", () => {
  logger.info({ port: resolvedPort }, "Server listening");
});
