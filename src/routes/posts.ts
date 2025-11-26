import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const posts = new Hono();

// Validation schemas
const createPostSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  userId: z.number().int().positive(),
});

const updatePostSchema = z.object({
  title: z.string().min(1).optional(),
  body: z.string().min(1).optional(),
});

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  userId: z.string().optional(),
  search: z.string().optional(),
});

// GET /posts - Get all posts with pagination
posts.get("/", zValidator("query", querySchema), async (c) => {
  const { page, limit, userId, search } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (userId) {
    where.userId = parseInt(userId);
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" as const } },
      { body: { contains: search, mode: "insensitive" as const } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
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
            email: true,
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    }),
    prisma.post.count({ where }),
  ]);

  return c.json({
    data: posts,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /posts/:id - Get a single post by ID
posts.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    return c.json({ error: "Post not found" }, 404);
  }

  return c.json(post);
});

// POST /posts - Create a new post
posts.post("/", zValidator("json", createPostSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const post = await prisma.post.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return c.json(post, 201);
  } catch (error: any) {
    if (error.code === "P2003") {
      return c.json({ error: "User not found" }, 400);
    }
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// PUT /posts/:id - Update a post
posts.put("/:id", zValidator("json", updatePostSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");

  try {
    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            email: true,
          },
        },
      },
    });

    return c.json(post);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json({ error: "Failed to update post" }, 500);
  }
});

// DELETE /posts/:id - Delete a post
posts.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    await prisma.post.delete({
      where: { id },
    });

    return c.json({ message: "Post deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Post not found" }, 404);
    }
    return c.json({ error: "Failed to delete post" }, 500);
  }
});

export default posts;
