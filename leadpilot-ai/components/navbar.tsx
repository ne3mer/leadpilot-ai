"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/mock-data";

export function Navbar() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl"
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          LeadPilot AI
        </Link>
        <ul className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="transition hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/dashboard"
          className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
        >
          Open App
        </Link>
      </nav>
    </motion.header>
  );
}
