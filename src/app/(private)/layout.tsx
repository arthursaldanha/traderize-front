import { AppSidebar } from "@/app/(private)/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import {
  AccountsProvider,
  JournalsProvider,
  StrategiesProvider,
} from "@/contexts";

export default function PrivateRoutesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AccountsProvider>
      <JournalsProvider>
        <StrategiesProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "calc(var(--spacing) * 72)",
                "--header-height": "calc(var(--spacing) * 12)",
              } as React.CSSProperties
            }
          >
            <AppSidebar variant="inset" />
            <SidebarInset>{children}</SidebarInset>
          </SidebarProvider>
        </StrategiesProvider>
      </JournalsProvider>
    </AccountsProvider>
  );
}
