import cron from "node-cron";
import logger from "../services/logger.service.js";

const PING_PATH = "/health";
const PING_INTERVAL = process.env.KEEP_ALIVE_INTERVAL || "*/10 * * * *";

const resolveBaseUrl = () => {
  if (process.env.SELF_URL) return process.env.SELF_URL.replace(/\/+$/, "");
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/+$/, "");
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}`;
};

const startKeepAliveJob = () => {
  if (process.env.NODE_ENV === "test") return;

  const baseUrl = resolveBaseUrl();
  const url = `${baseUrl}${PING_PATH}`;

  cron.schedule(PING_INTERVAL, async () => {
    try {
      const res = await fetch(url, {
        method: "GET",
        signal: AbortSignal.timeout(10000),
        headers: { "User-Agent": "MediSync-KeepAlive/1.0" },
      });

      if (res.ok) {
        logger.debug(`[KeepAlive] Ping OK (${res.status}) -> ${url}`);
      } else {
        logger.warn(`[KeepAlive] Ping returned ${res.status} -> ${url}`);
      }
    } catch (error) {
      logger.error(`[KeepAlive] Ping failed -> ${url}: ${error.message}`);
    }
  });

  logger.info(`[Cron] Keep-alive job started (pings ${url} on schedule)`);
};

export default startKeepAliveJob;
