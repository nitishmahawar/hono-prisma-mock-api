import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const photos = new Hono();

// Validation schemas
const createPhotoSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  thumbnailUrl: z.string().url(),
  albumId: z.number().int().positive(),
});

const updatePhotoSchema = z.object({
  title: z.string().min(1).optional(),
  url: z.string().url().optional(),
  thumbnailUrl: z.string().url().optional(),
});

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  albumId: z.string().optional(),
  search: z.string().optional(),
});

// GET /photos - Get all photos with pagination
photos.get("/", zValidator("query", querySchema), async (c) => {
  const { page, limit, albumId, search } = c.req.valid("query");
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const where: any = {};

  if (albumId) {
    where.albumId = parseInt(albumId);
  }

  if (search) {
    where.title = { contains: search, mode: "insensitive" as const };
  }

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: "desc" },
      include: {
        album: {
          select: {
            id: true,
            title: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    }),
    prisma.photo.count({ where }),
  ]);

  return c.json({
    data: photos,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
});

// GET /photos/:id - Get a single photo by ID
photos.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  const photo = await prisma.photo.findUnique({
    where: { id },
    include: {
      album: {
        select: {
          id: true,
          title: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
            },
          },
        },
      },
    },
  });

  if (!photo) {
    return c.json({ error: "Photo not found" }, 404);
  }

  return c.json(photo);
});

// POST /photos - Create a new photo
photos.post("/", zValidator("json", createPhotoSchema), async (c) => {
  const data = c.req.valid("json");

  try {
    const photo = await prisma.photo.create({
      data,
      include: {
        album: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return c.json(photo, 201);
  } catch (error: any) {
    if (error.code === "P2003") {
      return c.json({ error: "Album not found" }, 400);
    }
    return c.json({ error: "Failed to create photo" }, 500);
  }
});

// PUT /photos/:id - Update a photo
photos.put("/:id", zValidator("json", updatePhotoSchema), async (c) => {
  const id = parseInt(c.req.param("id"));
  const data = c.req.valid("json");

  try {
    const photo = await prisma.photo.update({
      where: { id },
      data,
      include: {
        album: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return c.json(photo);
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Photo not found" }, 404);
    }
    return c.json({ error: "Failed to update photo" }, 500);
  }
});

// DELETE /photos/:id - Delete a photo
photos.delete("/:id", async (c) => {
  const id = parseInt(c.req.param("id"));

  try {
    await prisma.photo.delete({
      where: { id },
    });

    return c.json({ message: "Photo deleted successfully" });
  } catch (error: any) {
    if (error.code === "P2025") {
      return c.json({ error: "Photo not found" }, 404);
    }
    return c.json({ error: "Failed to delete photo" }, 500);
  }
});

export default photos;
