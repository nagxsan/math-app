"use client"

import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import jwt from "jsonwebtoken";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname()
  const hideNavbarRoutes = ['/sign-in', '/sign-up'];
  if (hideNavbarRoutes.includes(pathname)) {
    return null;
  }
  
  const token = localStorage.getItem('mathtor-token');
  if (!token) {
    return null;
  }
  const data = jwt.decode(token);
  if (!data || typeof data === "string") {
    return null;
  }
  
  return (
    <nav className="px-8 py-6 flex flex-row items-center justify-between border border-gray-200">
      <div className="flex items-center text-gray-700 font-bold text-3xl">
        MathTor
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Image
            className="cursor-pointer"
            src="/empty-profile.svg"
            alt="Vercel logomark"
            width={36}
            height={36}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <span>Email: {data?.email}</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <span>Role: {data?.role}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => {
            localStorage.removeItem('mathtor-token');
            router.push('/sign-in');
          }}>
            <span className="text-red-500">Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}