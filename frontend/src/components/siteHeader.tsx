import { Link } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useQuery(userQueryOptions());

  return (
    <header className="sticky top-0 z-50 w-full border-border/40">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <Link to="/" className="text-2xl font-bold">
            ProxyLines
          </Link>
          <nav className="hidden items-center space-x-4 md:flex">
            <Link to="/" className="hover:underline">
              new
            </Link>
            <Link to="/" className="hover:underline">
              top
            </Link>
            <Link to="/" className="hover:underline">
              submit
            </Link>
          </nav>
        </div>
        <div className="hidden items-center space-x-4">
          {user ? (
            <>
              <span>{user}</span>
              <Button
                asChild
                size="sm"
                variant="secondary"
                className="text-primary-foreground"
              >
                <a href="api/account/logout">Logout</a>
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="text-primary-foreground"
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="md:hidden">
              <MenuIcon className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent className="mb-2 p-4">
            <SheetHeader className="items-center">
              <SheetTitle>ProxyLines</SheetTitle>
              <SheetDescription className="sr-only">
                Navigation
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col space-y-4">
              <Link
                onClick={() => setIsOpen(false)}
                to="/"
                className="hover:underline"
              >
                new
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                to="/"
                className="hover:underline"
              >
                top
              </Link>
              <Link
                onClick={() => setIsOpen(false)}
                to="/"
                className="hover:underline"
              >
                submit
              </Link>

              {user ? (
                <>
                  <span>{user}</span>
                  <Button
                    asChild
                    size="sm"
                    variant="secondary"
                    className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
                  >
                    <a href="api/account/logout">Logout</a>
                  </Button>
                </>
              ) : (
                <Button
                  asChild
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  variant="secondary"
                  className="bg-secondary-foreground text-primary-foreground hover:bg-secondary-foreground/70"
                >
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
