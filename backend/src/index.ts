import GitHub from "@auth/core/providers/github";
import { authHandler, initAuthConfig, verifyAuth } from "@hono/auth-js";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = {
  Bindings: {
    DB: D1Database;
  };
};

const app = new Hono<Env>()
  .use(
    "*",
    cors({
      origin: (_, c) => {
        return c.env.CLIENT_URL;
      },
      credentials: true,
    })
  )
  .use(
    "*",
    initAuthConfig((c) => ({
      secret: c.env.AUTH_SECRET,
      providers: [
        GitHub({
          clientId: c.env.GITHUB_CLIENT_ID,
          clientSecret: c.env.GITHUB_CLIENT_SECRET,
        }),
      ],
      callbacks: {
        async redirect() {
          return c.env.CLIENT_URL;
        },
        async signIn({ user }) {
          // TODO ユーザー情報を読み込む、なかったら作る
          return true;
        },
        async session({ session, token }) {
          // TODO ユーザーIDをDBのものにする
          return session;
        },
      },
    }))
  )
  .use("/api/auth/*", authHandler())
  .use("/api/*", verifyAuth())
  .get("/", async (c) => {
    const auth = c.get("authUser");
    const result = await c.env.DB.prepare("SELECT 1;").all();
    console.log("result:", result.success);
    return c.text(`Hello ${auth?.user?.name || "unknown user"}!`);
  });

export type AppType = typeof app;

export default app;
