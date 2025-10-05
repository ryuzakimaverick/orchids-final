import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../lib/prisma";

export const config = {
  api: {
    externalResolver: true,
  },
};

function setCorsHeaders(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  setCorsHeaders(res);

  if (_req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error("Failed to fetch posts", error);
    res.status(200).json({
      error: "Unable to fetch posts",
      posts: [
        {
          id: 1,
          title: "Sample Post",
          description: "Database connection failed. Showing static fallback.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    });
  }
}
