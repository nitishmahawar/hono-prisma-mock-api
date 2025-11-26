import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const comments = new Hono();

// Validation schemas
const createCommentSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  body: z.string().min(1),
  postId: z.number().int().positive(),
  userId: z.number().int().positive().optional(),
});

const updateCommentSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  body: z.string().min(1).optional(),
});

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  postId: z.string().optional(),
  userId: z.string().optional(),
  search: z.string().optional(),
});

// GET /comments - Get all comments with pagination
comments.get("/", zValidator("query", querySchema), async (c) => {
  const { page, limit, postId, userId, search } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (postId) {
    where.postId = parseInt(postId);
  }

  if (userId) {
    where.userId = parseInt(userId);
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" as const } },
      { email: { contains: search, mode: "insensitive" as const } },
      { body: { contains: search, mode: "insensitive" as const } },
    ];
  }

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    }),
    prisma.comment.count({ where }),
  ]);

  return c.json({
    data: comments,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /comments/:id - Get a single comment by ID
comments.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      post: {
        select: {
          id: true,
          title: true,
        },
      },
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
    },
  });

  if (!comment) {
    return c.json({ error: "Comment not found" }, 404);
  }

  return c.json(comment);
});

// POST /comments - Create a new comment
comments.post("/", zValidator("json", createCommentSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const comment = await prisma.comment.create({
      data,
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return c.json(comment, 201);
  } catch (error: any) {
    if (error.code === "P2003") {
      return c.json({ error: "Post or User not found" }, 400);
    }
    return c.json({ error: "Failed to create comment" }, 500);
  }
});

// PUT /comments/:id - Update a comment
comments.put("/:id", zValidator("json", updateCommentSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data,
      include: {
        post: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return c.json(comment);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Comment not found" }, 404);
    }
    return c.json({ error: "Failed to update comment" }, 500);
  }
});

// DELETE /comments/:id - Delete a comment
comments.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    await prisma.comment.delete({
      where: { id },
    });

    return c.json({ message: "Comment deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Comment not found" }, 404);
    }
    return c.json({ error: "Failed to delete comment" }, 500);
  }
});

export default comments;
