import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const CLIENT_CONTEXT = `
MMLABS CLIENT CONTEXT:
- Founded by Sam and Alvin, both children of immigrants, after watching powerful AI tools transform work while realizing people like their own parents were being left behind. Closing that gap is the founding reason this company exists.
- Serves two users: immigration lawyers (need efficiency, speed, trust signals) and their clients — often immigrant families navigating high-stakes paperwork under stress (need warmth, clarity, zero cognitive overhead).
- B2B2C model: law firms pay, client-facing portals are part of the product.
- Expanding into social work, case management, accounting — anywhere that is procedural, document-heavy, currently human-bottlenecked.
- Mantra: "AI for people who don't care about AI."
- Visual direction discussed in initial meeting: paint and ink splashes over pencil lines, possible character or critter direction — potentially to represent the AI agent itself.
- Confirmed visual avoidance: Notion aesthetic, pencil-line hand-drawn trend.
- MM does not currently stand for anything defined — this is an open strategic decision.
- April 10 incubator deadline is the immediate priority.
`;

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY is not set in environment variables');
    return NextResponse.json(
      { error: 'API key not configured' },
      { status: 500 }
    );
  }

  let formData: Record<string, string | string[]>;
  try {
    formData = await request.json();
  } catch (err) {
    console.error('Failed to parse request body:', err);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }

  const formSummary = Object.entries(formData)
    .map(([key, value]) => {
      if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
      return `${key}: ${value}`;
    })
    .join('\n');

  const anthropic = new Anthropic({ apiKey });

  // ── CALL 1 — CLIENT BRIEF ──
  let clientBrief;
  try {
    const clientResponse = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1400,
      system: `You are a senior brand strategist writing a working brand brief for MMLABS. You are writing FOR the designer Talia, to share with the clients Sam and Alvin.

CRITICAL: Do NOT restate or summarize the client's answers. ANALYZE them. Every section must read like a diagnosis, a decision, or a clearly reasoned recommendation — not a description of what was said.

Where there is clarity in their answers: state the plan confidently and directly, as if it is already agreed.
Where there is ambiguity: name exactly what is fixed versus flexible and explain why that distinction matters for the design work.

Tone: experienced creative director presenting a working plan. Present tense throughout. Never start a sentence with "You said", "Based on your answers", or "According to". Speak as if this is already the plan.`,
      messages: [
        {
          role: 'user',
          content: `Here are the client's discovery intake answers:

${formSummary}

${CLIENT_CONTEXT}

Return ONLY valid JSON with no markdown, no code fences, no preamble. Exact structure:
{
  "scopeAndTimeline": "2-3 analytical sentences. What is the actual plan for phase 1 vs phase 2 given the deadline. If the timeline is tight given what they need, name the implication and what gets prioritized.",
  "budgetAndTerms": "1-2 sentences. If budget was provided, assess honestly whether it is realistic for the stated scope. If not provided, name this as a blocker. Synthesize any working terms into how the engagement will run.",
  "technicalConstraints": "2-3 sentences. State which constraints are locked and directly affect design decisions now — platform, language, existing build. Address the naming and sub-brand situation as either resolved or open, and name the downstream design implication either way.",
  "positioning": "2-3 sentences. A strategic positioning recommendation — not a company description. The founding immigrant story is the brand's most differentiating asset; the recommendation should explain how to use it, not just note that it exists.",
  "personality": "2-3 sentences. Name the design implication of the pair choices. If there is tension between lawyer feel and client feel, state explicitly how the design system should hold both registers. What does this mean in practice for the visual system?",
  "visualDirection": "2-3 sentences. Based on the critter commitment level and role, state what direction is recommended and why. Name the implication of that choice for the system architecture. If the character direction is uncertain, name what needs to be decided and what changes if it goes each way.",
  "openItems": [
    "A specific decision that is blocking design work — name it precisely and state what is at stake if it goes unresolved",
    "Another blocker",
    "A third if genuinely needed — do not pad with generic observations"
  ]
}`,
        },
      ],
    });

    const clientText =
      clientResponse.content[0].type === 'text'
        ? clientResponse.content[0].text
        : '';

    console.log('Client brief raw response length:', clientText.length);

    try {
      const jsonMatch = clientText.match(/\{[\s\S]*\}/);
      clientBrief = jsonMatch
        ? JSON.parse(jsonMatch[0])
        : JSON.parse(clientText);
    } catch (parseErr) {
      console.error('Failed to parse client brief JSON:', parseErr);
      console.error('Raw client text:', clientText.slice(0, 500));
      // Use the raw text as scopeAndTimeline so the user sees something
      clientBrief = {
        scopeAndTimeline: clientText.slice(0, 400) || 'Brief generation returned unparseable content. Please try again.',
        budgetAndTerms: 'Budget assessment pending — raw response could not be parsed into structured sections.',
        technicalConstraints: 'Technical constraints to be reviewed in kickoff call.',
        positioning: 'Positioning recommendation will be finalized after brief regeneration.',
        personality: 'Design personality analysis pending.',
        visualDirection: 'Visual direction to be confirmed.',
        openItems: [
          'Brief generation encountered a formatting issue — regenerate or discuss in kickoff call',
        ],
      };
    }
  } catch (apiErr) {
    console.error('Anthropic API call 1 (client brief) failed:', apiErr);
    return NextResponse.json(
      {
        error: 'Client brief generation failed',
        details: apiErr instanceof Error ? apiErr.message : 'Unknown error',
      },
      { status: 500 }
    );
  }

  // ── CALL 2 — PRIVATE DESIGNER BRIEF ──
  let designerBrief = '';
  try {
    const designerResponse = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      system: `You are a senior creative director writing a private internal brief for Talia, a senior brand designer taking on MMLABS as a freelance client. This document is NOT for the client. It is Talia's execution guide.

Be direct, specific, and experienced. Write like a creative director handing off a project to a trusted designer — not like a consultant writing a report. Talia is strong and experienced. She does not need basics explained. She needs: real conflicts surfaced, real blockers identified, and a concrete action plan.`,
      messages: [
        {
          role: 'user',
          content: `Here are the client's discovery intake answers:

${formSummary}

${CLIENT_CONTEXT}

Return plain text with these exact section headers:

1. CONFLICT & TENSION ANALYSIS
For each conflict: name it specifically, explain why it creates a real design problem, give a concrete resolution path. Example of what a useful conflict looks like: 'They chose minimal/airy density but also want a front-and-center mascot. These are architecturally incompatible as defaults. Resolution: the character lives in specific emotional touchpoints — onboarding, empty states, error screens — while the core system stays minimal. This needs to be agreed before design starts.'

2. DECISION DEPENDENCY MAP
Format each entry as: '[Thing that cannot move] cannot move forward until [specific decision]. This affects [concrete downstream impact].'
List every meaningful dependency. Be specific about what actually breaks if the decision is delayed.

3. CRITICAL PATH — APRIL 10
Given the deadline, the exact order of operations. What must be resolved in the first call. What gets designed first and why. What waits until phase 2. Be concrete about timing.

4. RISK FLAGS
Each risk: what it is, what triggers it, how to mitigate it before it becomes a problem. Focus on risks that are specific to this client and this project — not generic freelance advice.

5. ASSET COLLECTION CHECKLIST
Everything Talia needs to collect from the client before starting. Existing files, design assets, photography, brand-adjacent materials, access to tools and accounts, confirmation of decisions that are currently open. Format as a checklist.

6. TECHNICAL PRODUCTION NOTES
Logo: SVG master, PNG 1x/2x/3x, white/black/transparent variants, favicon kit (16px ICO, 32px PNG, 180px Apple touch icon PNG), OG image 1200x630 PNG. Must test legibility at 32px before finalizing — if wordmark breaks at small sizes, a simplified icon-only variant is required.
Color: hex, RGB, HSL, and CMYK values. WCAG AA contrast check on all text/background combinations — given the target audience (older immigrants, variable screen quality, stress conditions) aim for AAA on primary text where possible. Note any dark mode considerations.
Typography: confirm web licensing before finalizing. Check character set coverage for any language requirements — Spanish diacritics at minimum even if not immediately needed. Note variable font availability. Deliver a fallback stack.
Figma: Page 1 Brand System, Page 2 Components, Page 3 Applied, Page 4 Archive. Styles for all colors and type, no hardcoded values. Every layer named.
File naming: lowercase-kebab-case, version numbers, source files separated from exports.

7. OPEN QUESTIONS FOR FINALIZATION CALL
Numbered list. These are questions that must be answered before design work starts — not during. For each, note why it is blocking.

8. FIRST TWO WEEKS — ACTION PLAN
Structure as: Day 1 / Days 2-3 / End of week 1 / Days 8-10 / Days 11-14 (April 10).
Specific tasks, not general advice. Assume April 10 is hard. Flag if the timeline is at risk given what is still unresolved.`,
        },
      ],
    });

    designerBrief =
      designerResponse.content[0].type === 'text'
        ? designerResponse.content[0].text
        : '';

    console.log('Designer brief generated, length:', designerBrief.length);
  } catch (apiErr) {
    console.error('Anthropic API call 2 (designer brief) failed:', apiErr);
    designerBrief =
      '[Designer brief generation failed. Error: ' +
      (apiErr instanceof Error ? apiErr.message : 'Unknown') +
      ']';
  }

  return NextResponse.json({ clientBrief, designerBrief });
}
