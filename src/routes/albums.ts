import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const albums = new Hono();

// Validation schemas
const createAlbumSchema = z.object({
  title: z.string().min(1),
  userId: z.number().int().positive(),
});

const updateAlbumSchema = z.object({
  title: z.string().min(1).optional(),
});

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  userId: z.string().optional(),
  search: z.string().optional(),
});

// GET /albums - Get all albums with pagination
albums.get("/", zValidator("query", querySchema), async (c) => {
  const { page, limit, userId, search } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (userId) {
    where.userId = parseInt(userId);
  }

  if (search) {
    where.title = { contains: search, mode: "insensitive" as const };
  }

  const [albums, total] = await Promise.all([
    prisma.album.findMany({
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
        _count: {
          select: { photos: true },
        },
      },
    }),
    prisma.album.count({ where }),
  ]);

  return c.json({
    data: albums,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /albums/:id - Get a single album by ID
albums.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const album = await prisma.album.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
        },
      },
      photos: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!album) {
    return c.json({ error: "Album not found" }, 404);
  }

  return c.json(album);
});

// POST /albums - Create a new album
albums.post("/", zValidator("json", createAlbumSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const album = await prisma.album.create({
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

    return c.json(album, 201);
  } catch (error: any) {
    if (error.code === "P2003") {
      return c.json({ error: "User not found" }, 400);
    }
    return c.json({ error: "Failed to create album" }, 500);
  }
});

// PUT /albums/:id - Update an album
albums.put("/:id", zValidator("json", updateAlbumSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");

  try {
    const album = await prisma.album.update({
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

    return c.json(album);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Album not found" }, 404);
    }
    return c.json({ error: "Failed to update album" }, 500);
  }
});

// DELETE /albums/:id - Delete an album
albums.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    await prisma.album.delete({
      where: { id },
    });

    return c.json({ message: "Album deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Album not found" }, 404);
    }
    return c.json({ error: "Failed to delete album" }, 500);
  }
});

export default albums;
