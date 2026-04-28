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
      className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur"
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="text-lg font-semibold tracking-tight text-black">
          LeadPilot AI
        </Link>
        <ul className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="transition hover:text-emerald-700">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/dashboard"
          className="rounded-full border border-black/15 bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          Open App
        </Link>
      </nav>
    </motion.header>
  );
}
