import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const users = new Hono();

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  street: z.string().optional(),
  suite: z.string().optional(),
  city: z.string().optional(),
  zipcode: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),
  companyName: z.string().optional(),
  companyCatchPhrase: z.string().optional(),
  companyBs: z.string().optional(),
});

const updateUserSchema = createUserSchema.partial();

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
});

// GET /users - Get all users with pagination
users.get("/", zValidator("query", querySchema), async (c) => {
  const { page, limit, search } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { username: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return c.json({
    data: users,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /users/:id - Get a single user by ID
users.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      posts: true,
      albums: true,
      todos: true,
      comments: true,
    },
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// POST /users - Create a new user
users.post("/", zValidator("json", createUserSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const user = await prisma.user.create({
      data,
    });

    return c.json(user, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return c.json({ error: "Username or email already exists" }, 400);
    }
    return c.json({ error: "Failed to create user" }, 500);
  }
});

// PUT /users/:id - Update a user
users.put("/:id", zValidator("json", updateUserSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");

  try {
    const user = await prisma.user.update({
      where: { id },
      data,
    });

    return c.json(user);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "User not found" }, 404);
    }
    if (error.code === "P2002") {
      return c.json({ error: "Username or email already exists" }, 400);
    }
    return c.json({ error: "Failed to update user" }, 500);
  }
});

// DELETE /users/:id - Delete a user
users.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    await prisma.user.delete({
      where: { id },
    });

    return c.json({ message: "User deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "User not found" }, 404);
    }
    return c.json({ error: "Failed to delete user" }, 500);
  }
});

export default users;
