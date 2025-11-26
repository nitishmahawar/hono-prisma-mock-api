import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { users, posts, comments, albums, photos, todos } from "./routes";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Health check
app.get("/", (c) => {
  return c.json({
    message: "Prisma7 Todos API",
    version: "1.0.0",
    status: "healthy",
  });
});

// API Routes
const api = new Hono();

api.route("/users", users);
api.route("/posts", posts);
api.route("/comments", comments);
api.route("/albums", albums);
api.route("/photos", photos);
api.route("/todos", todos);

app.route("/api", api);

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error(`Error: ${err.message}`);
  return c.json({ error: "Internal server error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`🚀 Server is running on http://localhost:${info.port}`);
    console.log(
      `📚 API documentation available at http://localhost:${info.port}/api`
    );
  }
);
