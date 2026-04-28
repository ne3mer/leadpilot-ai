import {
  Bot,
  Brain,
  Crown,
  Gem,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import type { Lead } from "@/lib/lead-types";

export const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Case Study", href: "/case-study" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Login", href: "/login" },
];

export const featureItems = [
  {
    title: "AI Lead Scoring",
    description:
      "Automatically prioritize leads based on intent signals, engagement, and deal potential.",
    icon: Target,
  },
  {
    title: "Smart Follow-Ups",
    description:
      "Generate personalized outreach sequences and trigger follow-ups at the perfect moment.",
    icon: Bot,
  },
  {
    title: "Pipeline Intelligence",
    description:
      "Get real-time forecasting and bottleneck alerts with AI-driven recommendations.",
    icon: Brain,
  },
  {
    title: "Instant Insights",
    description:
      "Track conversion trends and campaign performance from one executive-ready dashboard.",
    icon: Sparkles,
  },
];

export const pricingTiers = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "For teams launching AI-assisted lead workflows.",
    icon: Zap,
    features: ["1,000 leads/month", "Basic automation", "Email support"],
    featured: false,
  },
  {
    name: "Pro",
    price: "$129",
    period: "/month",
    description: "For scaling teams that need conversion acceleration.",
    icon: Gem,
    features: [
      "10,000 leads/month",
      "Advanced AI follow-ups",
      "Pipeline analytics",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For high-volume revenue organizations with custom needs.",
    icon: Crown,
    features: [
      "Unlimited leads",
      "Dedicated AI strategist",
      "Custom integrations",
      "SLA + white-glove onboarding",
    ],
    featured: false,
  },
];

export const statsCards = [
  { label: "Total Leads", value: "12,480", delta: "+12.4%" },
  { label: "Conversion Rate", value: "31.2%", delta: "+4.1%" },
  { label: "Revenue Pipeline", value: "$428K", delta: "+9.7%" },
  { label: "AI Follow-ups", value: "2,394", delta: "+18.3%" },
];

export const pipelineData = [
  { month: "Jan", leads: 320, conversions: 92 },
  { month: "Feb", leads: 410, conversions: 121 },
  { month: "Mar", leads: 460, conversions: 148 },
  { month: "Apr", leads: 520, conversions: 171 },
  { month: "May", leads: 580, conversions: 194 },
  { month: "Jun", leads: 640, conversions: 228 },
];

export const leadsData: Omit<Lead, "id">[] = [
  {
    name: "Sophia Martinez",
    company: "Northstar",
    email: "sophia@northstar.io",
    status: "Qualified",
  },
  {
    name: "Liam Carter",
    company: "Skyline HQ",
    email: "liam@skylinehq.com",
    status: "Contacted",
  },
  {
    name: "Olivia Nguyen",
    company: "FuturePath",
    email: "olivia@futurepath.ai",
    status: "Proposal Sent",
  },
  {
    name: "Noah Bennett",
    company: "PulseGrid",
    email: "noah@pulsegrid.com",
    status: "Negotiation",
  },
  {
    name: "Ava Robinson",
    company: "HarborWorks",
    email: "ava@harborworks.co",
    status: "New",
  },
];
