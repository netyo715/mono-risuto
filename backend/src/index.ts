import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono().use("*", cors({ origin: "*" })).get("/", (c) => {
  return c.text("Hello Hono!");
});

export type AppType = typeof app;

export default app;
