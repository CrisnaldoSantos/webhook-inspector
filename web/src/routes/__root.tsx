import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Sidebar } from "../components/sidebar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const queryClient = new QueryClient();

  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <div className="h-screen bg-zinc-900">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={20} minSize={15} maxSize={40}>
              <Sidebar />
            </Panel>
            <PanelResizeHandle className="w-px bg-zinc-700 hover:bg-zinc-600 transition-colors duration-200" />
            <Panel defaultSize={80} minSize={60}>
              <Outlet />
            </Panel>
          </PanelGroup>
        </div>
      </QueryClientProvider>
    </React.Fragment>
  );
}
