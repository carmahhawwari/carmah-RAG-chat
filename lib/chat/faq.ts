export type Intent =
  | "INTERNSHIPS" | "BACKGROUND" | "UNIQUE" | "PROJECTS" | "SKILLS" | "CONTACT" | "OTHER";

const KW = (s: string) => s.toLowerCase();

export function detectIntent(q: string): Intent {
  const t = KW(q);
  const has = (...keys: string[]) => keys.some(k => t.includes(k));
  // simple typo tolerance
  const looksLike = (needle: string) =>
    new RegExp(needle.split("").join(".?"), "i").test(q); // e.g., historyu ≈ history

  if (has("internship","internships","intern","work experience")) return "INTERNSHIPS";
  if (has("project","projects","case study","case studies")) return "PROJECTS";
  if (has("skill","skills","tools","tech stack","stack")) return "SKILLS";
  if (has("contact","email","reach","linkedin")) return "CONTACT";
  if (has("unique","different","superpower","strength")) return "UNIQUE";
  if (has("background","bio","about you","about","summary","who are you") || looksLike("history")) return "BACKGROUND";
  return "OTHER";
}
