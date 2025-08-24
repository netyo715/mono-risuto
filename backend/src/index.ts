import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = {
  Bindings: {
    DB: D1Database;
  };
};

const app = new Hono<Env>()
  .use("*", cors({ origin: "*" }))
  .get("/", async (c) => {
    const result = await c.env.DB.prepare("SELECT 1;").all();
    console.log("result:", result.success);
    return c.text("Hello Hono!");
  });

export type AppType = typeof app;

export default app;
