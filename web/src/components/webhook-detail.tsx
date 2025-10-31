import { useSuspenseQuery } from "@tanstack/react-query";
import { webhookDetailsSchema } from "../http/schemas/webhook";
import { SectionDataTable } from "./section-data-table";
import { SectionTitle } from "./section-title";
import { CodeBlock } from "./ui/code-block";
import { WebhookDetailHeader } from "./webhook-detail-header";

interface WebhookDetailProps {
  id: string;
}
export function WebhookDetail({ id }: WebhookDetailProps) {
  const { data } = useSuspenseQuery({
    queryKey: ["webhooks", id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/api/webhooks/${id}`);
      const data = await response.json();
      return webhookDetailsSchema.parse(data);
    },
  });

  const overviewData = [
    { key: "Method", value: data.method.toUpperCase() },
    { key: "Status Code", value: data.statusCode.toString() },
    { key: "Content-Type", value: data.contentType || "application/json" },
    { key: "Content-Length", value: data.contentLength?.toString() || "1234" },
  ];

  const parsedHeaders = Object.entries(data.headers).map(([key, value]) => ({
    key,
    value,
  }));

  const parsedQueryParams = data.queryParams
    ? Object.entries(data.queryParams).map(([key, value]) => ({
        key,
        value,
      }))
    : [{ key: "No Query Parameters", value: "" }];

  const hasQueryParams =
    data.queryParams && Object.keys(data.queryParams).length > 0;

  return (
    <div className="flex h-full flex-col">
      <WebhookDetailHeader
        method={data.method}
        pathname={data.pathname}
        ip={data.ip}
        createdAt={data.createdAt}
      />

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-6">
          <div className="space-y-4">
            <SectionTitle>Request Overview</SectionTitle>
            <SectionDataTable data={overviewData} />
          </div>

          {hasQueryParams && (
            <div className="space-y-4">
              <SectionTitle>Query Parameters</SectionTitle>
              <SectionDataTable data={parsedQueryParams} />
            </div>
          )}

          <div className="space-y-4">
            <SectionTitle>Headers</SectionTitle>
            <SectionDataTable data={parsedHeaders} />
          </div>

          <div className="space-y-4">
            <SectionTitle>Body</SectionTitle>
            <CodeBlock code={data.body || "No body content"} />
          </div>
        </div>
      </div>
    </div>
  );
}
