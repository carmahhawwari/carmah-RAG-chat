export type Intent =
  | "GREET" | "NAME" | "WHAT_DO_YOU_DO" | "FOOD" | "FUN_FACT"
  | "PROJECTS" | "EXPERIENCE" | "SKILLS" | "CONTACT"
  | "UNKNOWN";

const kw = (s: string) => s.toLowerCase();

export function classifyIntent(input: string): Intent {
  const s = kw(input);
  if (/(hi|hello|hey)\b/.test(s)) return "GREET";
  if (/(your name|who are you|whats ur name|what's your name)/.test(s)) return "NAME";
  if (/(what do you do|who do you help|purpose|why are you here)/.test(s)) return "WHAT_DO_YOU_DO";
  if (/(food|favorite food|what do you like to eat)/.test(s)) return "FOOD";
  if (/(fun fact|fact about you)/.test(s)) return "FUN_FACT";
  if (/(project|case study|work)/.test(s)) return "PROJECTS";
  if (/(experience|internship|apple|pwc|startup)/.test(s)) return "EXPERIENCE";
  if (/(skill|tools|figma|python|data)/.test(s)) return "SKILLS";
  if (/(contact|email|reach|talk)/.test(s)) return "CONTACT";
  return "UNKNOWN";
}

