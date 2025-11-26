import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const todos = new Hono();

// Validation schemas
const createTodoSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean().optional().default(false),
  userId: z.number().int().positive(),
});

const updateTodoSchema = z.object({
  title: z.string().min(1).optional(),
  completed: z.boolean().optional(),
});

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  userId: z.string().optional(),
  completed: z.string().optional(),
  search: z.string().optional(),
});

// GET /todos - Get all todos with pagination
todos.get("/", zValidator("query", querySchema), async (c) => {
  const { page, limit, userId, completed, search } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (userId) {
    where.userId = parseInt(userId);
  }

  if (completed !== undefined) {
    where.completed = completed === "true";
  }

  if (search) {
    where.title = { contains: search, mode: "insensitive" as const };
  }

  const [todos, total] = await Promise.all([
    prisma.todo.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    }),
    prisma.todo.count({ where }),
  ]);

  return c.json({
    data: todos,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /todos/:id - Get a single todo by ID
todos.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const todo = await prisma.todo.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  if (!todo) {
    return c.json({ error: "Todo not found" }, 404);
  }

  return c.json(todo);
});

// POST /todos - Create a new todo
todos.post("/", zValidator("json", createTodoSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const todo = await prisma.todo.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return c.json(todo, 201);
  } catch (error: any) {
    if (error.code === "P2003") {
      return c.json({ error: "User not found" }, 400);
    }
    return c.json({ error: "Failed to create todo" }, 500);
  }
});

// PUT /todos/:id - Update a todo
todos.put("/:id", zValidator("json", updateTodoSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");

  try {
    const todo = await prisma.todo.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return c.json(todo);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Todo not found" }, 404);
    }
    return c.json({ error: "Failed to update todo" }, 500);
  }
});

// PATCH /todos/:id/toggle - Toggle todo completion status
todos.patch("/:id/toggle", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    const todo = await prisma.todo.findUnique({ where: { id } });

    if (!todo) {
      return c.json({ error: "Todo not found" }, 404);
    }

    const updatedTodo = await prisma.todo.update({
      where: { id },
      data: { completed: !todo.completed },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return c.json(updatedTodo);
  } catch (error: any) {
    return c.json({ error: "Failed to toggle todo" }, 500);
  }
});

// DELETE /todos/:id - Delete a todo
todos.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    await prisma.todo.delete({
      where: { id },
    });

    return c.json({ message: "Todo deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Todo not found" }, 404);
    }
    return c.json({ error: "Failed to delete todo" }, 500);
  }
});

export default todos;
