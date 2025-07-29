"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Main navigation items
const mainNavItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

// Tools dropdown items
const toolsItems = [
  { name: "Aspect Ratio Calculator", href: "/tools/aspect-ratio" },
  { name: "Export Settings", href: "/tools/export-settings" },
  { name: "Storage Calculator", href: "/tools/storage" },
  { name: "Frame Rate Calculator", href: "/tools/frame-rate" },
  { name: "Color Space Converter", href: "/tools/color-space" },
  { name: "Timecode Calculator", href: "/tools/timecode" },
  { name: "Shot List Generator", href: "/tools/shot-list" },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo with Site title */}
        <Link href="/" className="flex items-center gap-2">
        <Image src="/site-logo.png" alt="Logo" width={40} height={40} />

          <span className="text-xl font-bold text-primary">Video Editor&apos;s Toolkit</span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden md:flex md:items-center md:gap-6">
          {mainNavItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.href} 
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.name}
            </Link>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 px-4">
                Tools
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {toolsItems.map((item) => (
                <DropdownMenuItem key={item.name} asChild>
                  <Link href={item.href} className="w-full cursor-pointer">
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu className={cn("h-6 w-6", isMenuOpen ? "hidden" : "block")} />
          <X className={cn("h-6 w-6", isMenuOpen ? "block" : "hidden")} />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile navigation */}
      <div className={cn("container md:hidden", isMenuOpen ? "block" : "hidden")}>
        <div className="flex flex-col space-y-3 pb-3">
          {mainNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="pt-2 pb-1 text-xs font-semibold text-muted-foreground uppercase">
            Tools
          </div>
          
          {toolsItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium pl-2 transition-colors hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
