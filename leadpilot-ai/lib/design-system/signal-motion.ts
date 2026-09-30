/** LeadPilot motion language — pair with CSS in globals.css */

export const signalMotion = {
  pulseDuration: "var(--lp-signal-pulse-duration)",
  connectDuration: "var(--lp-signal-connect-duration)",
  editorialStagger: "var(--lp-duration-normal)",
  aiGenerateDuration: "var(--lp-signal-ai-duration)",
} as const;

export const signalMotionClass = {
  pulse: "lp-motion-signal-pulse",
  connect: "lp-motion-signal-connect",
  editorialEnter: "lp-motion-editorial-enter",
  aiActive: "lp-motion-ai-signal",
} as const;
