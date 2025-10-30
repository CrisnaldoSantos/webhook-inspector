import { db } from "@/db";
import { webhooks } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createSelectSchema } from "drizzle-zod";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const captureWebhook: FastifyPluginAsyncZod = async (app) => {
  app.all(
    "/capture/*",
    {
      schema: {
        summary: "Capture incoming webhook requests",
        tags: ["External"],
        hide: true,
        params: z.object({
          id: z.uuidv7(),
        }),
        response: {
          201: z.object({
            id: z.uuidv7(),
          }),
        },
      },
    },
    async (request, reply) => {
      const method = request.method;
      const ip = request.ip;
      const pathname = new URL(request.url).pathname.replace("/capture", "");
      const headers = request.headers;
      const contentType = headers["content-type"];
      const contentLength = headers["content-length"];
      const body = request.body;

      const result = await db
        .insert(webhooks)
        .values({
          ip,
          method,
          pathname,
          contentType: contentType ? String(contentType) : null,
          contentLength: contentLength ? Number(contentLength) : null,
          body: body
            ? typeof body === "string"
              ? body
              : JSON.stringify(body)
            : null,
          headers: { ...headers } as Record<string, string>,
        })
        .returning({ id: webhooks.id });

      return reply.status(201).send({ id: result[0].id });
    }
  );
};
