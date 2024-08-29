import cors from "@elysiajs/cors";
import Elysia, { t } from "elysia";
import { login, register } from "./controllers/auth.controller";

const app = new Elysia();
const PORT: number = +(process.env.PORT || 5000);
const NODE_ENV = process.env.NODE_ENV ?? "development";

app.use(
  cors({
    origin: [
      "https://rishabhportfolio.site",
      "http://localhost:3000",
      "https://www.rishabhportfolio.site",
    ],
    credentials: true,
  })
);

app.get("/", (c) => {
  return "Hello, World!";
});

app.post(
  "/auth/register",
  async (c) => {
    const { name, email, password } = c.body;
    const { success, message, status } = await register(name, email, password);

    c.set.status = status;
    return {
      success,
      message,
    };
  },
  {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String(),
    }),
  }
);

app.post(
  "/auth/login",
  async (c) => {
    const { email, password } = c.body;
    const { success, message, status, cookieToken } = await login(
      email,
      password
    );

    const { token } = c.cookie;

    if (cookieToken) {
      token.value = cookieToken;
      token.httpOnly = true;
      token.sameSite = true;
      token.expires = new Date(new Date().getTime() + 7 * 60 * 60 * 1000);
    }

    c.set.status = status;
    return {
      success,
      message,
    };
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  }
);

app.listen(PORT, () => {
  console.log(`App is running on port:- ${PORT}`);
});
