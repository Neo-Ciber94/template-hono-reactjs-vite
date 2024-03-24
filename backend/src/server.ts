import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

interface Todo {
  id: string;
  text: string;
}

const todosMap = new Map<string, Todo>();

const app = new Hono()
  .use(cors())
  .get("/todos", (c) => {
    return c.json(Array.from(todosMap.values()));
  })
  .get("/todos/:id", (c) => {
    const id = c.req.param("id");
    const todo = todosMap.get(id);

    if (!todo) {
      return c.json({ error: "Todo not found" }, { status: 404 });
    }

    return c.json(todo);
  })
  .post("/todos", async (c) => {
    const { text } = await c.req.json();
    const id = crypto.randomUUID();
    const todo: Todo = { id, text };
    todosMap.set(id, todo);
    return c.json(todo, { status: 201 });
  })
  .put("/todos/:id", async (c) => {
    const id = c.req.param("id");
    const { text } = await c.req.json();
    const todo = todosMap.get(id);

    if (!todo) {
      return c.json({ error: "Todo not found" }, { status: 404 });
    }

    todo.text = text;
    todosMap.set(id, todo);
    return c.json(todo);
  })
  .delete("/todos/:id", (c) => {
    const id = c.req.param("id");
    const todo = todosMap.get(id);

    if (!todo) {
      return c.json({ error: "Todo not found" }, { status: 404 });
    }

    todosMap.delete(id);
    return c.json(todo);
  });

const port = Number(process.env.PORT || 5000);
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});
