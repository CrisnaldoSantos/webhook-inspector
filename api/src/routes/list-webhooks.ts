import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { request } from "http";
import { z } from "zod";

export const listWebhooks: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/api/webhooks",
    {
      schema: {
        summary: "List all registered webhooks",
        tags: ["Webhooks"],
        querystring: z.object({
          limit: z.coerce.number().min(1).max(100).default(20),
        }),
        response: {
          200: z.array(
            z.object({
              id: z.string().uuid(),
              url: z.string().url(),
              events: z.array(z.string()),
            })
          ),
        },
      },
    },
    async (request, reply) => {
      const { limit } = request.query;
      const size = Math.max(1, Math.min(100, limit));
      const webhooks = Array.from({ length: size }, (_, i) => ({
        id:
          typeof crypto !== "undefined" &&
          typeof crypto.randomUUID === "function"
            ? crypto.randomUUID()
            : `00000000-0000-0000-0000-00000000000${i}`,
        url: `https://example.com/webhook/${i + 1}`,
        events: ["created", "updated"],
      }));
      return reply.status(200).send(webhooks);
    }
  );
};
