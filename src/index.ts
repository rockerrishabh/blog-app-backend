import cors from "@elysiajs/cors";
import Elysia, { t } from "elysia";
import { register } from "./controllers/auth.controller";

const app = new Elysia();
const PORT = Bun.env.PORT || 5000;

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`App is running on port:- ${PORT}`);
});
