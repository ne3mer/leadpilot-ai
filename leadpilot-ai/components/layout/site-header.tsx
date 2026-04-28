"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { navLinks } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export function SiteHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur"
    >
      <Container className="flex items-center justify-between py-4">
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

        <Link href="/dashboard">
          <Button variant="primary" className="px-4 py-2 text-sm">
            Open App
          </Button>
        </Link>
      </Container>
    </motion.header>
  );
}
