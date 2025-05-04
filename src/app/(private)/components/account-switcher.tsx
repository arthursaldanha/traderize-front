"use client";

import * as React from "react";
import {
  ChevronsUpDown,
  Command,
  GalleryVerticalEnd,
  Plus,
} from "lucide-react";

import { DialogCreateAccount } from "@/app/(private)/components/Dialogs/Account/create";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Account } from "@/contexts/accounts";
import { useDisclosure } from "@/hooks/use-disclosure";

export function AccountSwitcher({ accounts }: { accounts: Account[] }) {
  const dialoCreateAccount = useDisclosure();
  const { isMobile } = useSidebar();
  const [activeAccount, setActiveTeam] = React.useState(accounts[0]);

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Contas</span>
                  <span className="truncate text-xs">
                    Adicione uma conta aqui
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              align="start"
              side={isMobile ? "bottom" : "right"}
              sideOffset={4}
            >
              {!!accounts.length && (
                <>
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    Teams
                  </DropdownMenuLabel>

                  {accounts.map((team, index) => (
                    <DropdownMenuItem
                      key={team.id}
                      onClick={() => setActiveTeam(team)}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <Command className="size-3.5 shrink-0" />
                      </div>
                      {team.broker}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator />
                </>
              )}

              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={dialoCreateAccount.onOpen}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Adicionar conta
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <DialogCreateAccount
        isOpen={dialoCreateAccount.isOpen}
        handleOpen={dialoCreateAccount.toggle}
      />
    </>
  );
}
