import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";

export default function LeadNotFoundPage() {
  return (
    <div className="min-h-screen bg-transparent text-slate-950">
      <SiteHeader />
      <Container className="py-10">
        <Card className="mx-auto max-w-lg p-8 text-center">
          <h1 className="text-2xl font-semibold text-black">Lead not found</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This lead does not exist or you do not have access to it.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Back to Leads
          </Link>
        </Card>
      </Container>
    </div>
  );
}
