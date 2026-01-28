export function classifyIntent(input) {
  const s = input.toLowerCase();
  if (/(hi|hello|hey)\b/.test(s)) return "GREET";
  if (/(your name|who are you|whats ur name|what's your name)/.test(s)) return "NAME";
  if (/(what do you do|who do you help|purpose|why are you here)/.test(s)) return "WHAT_DO_YOU_DO";
  if (/(tell me about yourself|about yourself|about you|who is carmah|introduce yourself|background|bio|summary)/.test(s)) return "ABOUT";
  if (/(tell me about carmah|about carmah|what does she like|what does she love|what does she enjoy|what inspires her|what is her personality|what is her style|what is her background)/.test(s)) return "PERSONAL";
  if (/(food|favorite food|what do you like to eat)/.test(s)) return "FOOD";
  if (/(fun fact|fact about you)/.test(s)) return "FUN_FACT";
  if (/(hobbies|hobby|what do you enjoy|enjoy doing|creative writing|writing|book|op-ed)/.test(s)) return "HOBBIES";
  if (/(project|case study|work)/.test(s)) return "PROJECTS";
  if (/(experience|internship|apple|pwc|startup|worked|work experience)/.test(s)) return "EXPERIENCE";
  if (/(skill|tools|figma|python|data)/.test(s)) return "SKILLS";
  if (/(contact|email|reach|talk)/.test(s)) return "CONTACT";
  if (/(how does she design|design philosophy|design approach|design process|what drives her|what motivates her)/.test(s)) return "DESIGN_PHILOSOPHY";
  return "UNKNOWN";
}

