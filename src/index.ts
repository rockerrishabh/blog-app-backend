import Elysia from "elysia";

const app = new Elysia();
const PORT = Bun.env.PORT || 5000;

app.get("/", (c) => {
  return "Hello, World!";
});

app.listen(PORT, () => {
  console.log(`App is running on port:- ${PORT}`);
});
