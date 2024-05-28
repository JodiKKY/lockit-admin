"use client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NAVBAR_LINKS } from "@/constants";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function AppLayout({ children }) {
  //We use the usePathname hook to get the current route path that we are on
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[220px] lg:w-[240px] flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col gap-4 px-5 sm:py-5">
          <div className="flex items-center gap-2">
            <p className="text-primary">LockIt</p>
          </div>
          <br />
          {NAVBAR_LINKS.map((link, index) => {
            return (
              <Link
                href={`${link.href}`}
                key={index}
                className={cn(
                  "text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm",
                  {
                    "text-primary": pathname === `${link.href}`,
                  }
                )}
              >
                {link.icon}
                {link.title}
              </Link>
            );
          })}
        </nav>
        <nav className="mt-auto flex flex-col gap-4 px-5 sm:py-5"></nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:pl-[220px] lg:pl-[240px]">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4">
          <div className="w-full justify-end items-center hidden sm:flex">
            <div className="flex gap-5">User Profile</div>
          </div>
          <div className="flex justify-between items-center w-full sm:hidden">
            <div className="flex gap-3 items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <nav className="grid gap-6 text-lg font-medium">
                    {NAVBAR_LINKS.map((link, index) => {
                      return (
                        <SheetTrigger asChild key={index}>
                          <Link
                            href={`${link.href}`}
                            className={cn(
                              "text-muted-foreground hover:text-foreground",
                              {
                                "text-foreground": pathname === `${link.href}`,
                              }
                            )}
                          >
                            {link.title}
                          </Link>
                        </SheetTrigger>
                      );
                    })}
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>
        <main className="px-6">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;
