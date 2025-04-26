import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { MenuIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="container mx-auto flex items-center justify-between p-4 space-x-4">
        <Link to="/" className="text-2xl font-bold">
          ProxyLines
        </Link>
        <nav className="hidden items-center space-x-4 md:flex">
          <Link to="/about" className="hover:underline">
            About
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="secondary" size="icon" className="md:hidden">
              <MenuIcon size="15" />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-neutral-50">
            <SheetHeader>
              <SheetTitle asChild>
                <Link to="/" className="text-2xl">
                  PL
                </Link>
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigation
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col p-4">
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
