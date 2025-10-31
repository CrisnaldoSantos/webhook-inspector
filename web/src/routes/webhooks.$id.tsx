import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { WebhookDetail } from "../components/webhook-detail";

export const Route = createFileRoute("/webhooks/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WebhookDetail id={id} />
    </Suspense>
  );
}
