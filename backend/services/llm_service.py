"""AI-assisted career explanation using local Ollama with safe fallback."""

import re
import requests

from ..config import OLLAMA_URL, OLLAMA_MODEL


OLLAMA_TIMEOUT = 45


def _clean_list(items):
    """Remove duplicates while preserving order."""
    result = []
    seen = set()

    for item in items or []:
        item = str(item).strip()

        if not item:
            continue

        key = item.lower()

        if key not in seen:
            seen.add(key)
            result.append(item)

    return result


def _clean_ai_output(text):
    """Clean repetitive or unwanted model formatting."""
    if not text:
        return None

    text = text.strip()

    # Remove markdown formatting.
    text = re.sub(r"\*\*", "", text)
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)

    # Remove accidental excessive blank lines.
    text = re.sub(r"\n{3,}", "\n\n", text)

    return text.strip() or None


def _call_ollama(prompt: str):
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.15,
                    "num_predict": 450,
                },
            },
            timeout=OLLAMA_TIMEOUT,
        )

        response.raise_for_status()

        result = response.json().get("response") or ""

        return _clean_ai_output(result)

    except Exception as exc:
        print(
            "Ollama unavailable; using deterministic fallback:",
            exc,
        )
        return None


def generate_explanation(
    role,
    score,
    strong,
    improvement,
    missing,
):
    strong = _clean_list(strong)
    improvement = _clean_list(improvement)
    missing = _clean_list(missing)

    strong_text = ", ".join(strong) if strong else "None"
    improvement_text = (
        ", ".join(improvement)
        if improvement
        else "None"
    )
    missing_text = (
        ", ".join(missing)
        if missing
        else "None"
    )

    fallback = f"""CURRENT READINESS:
Your current readiness for {role} is {score}%. You have {len(strong)} strong skill(s), {len(improvement)} skill(s) that need improvement, and {len(missing)} missing skill(s).

STRENGTHS:
You already have a useful foundation in {strong_text}.

IMPORTANT GAPS:
The main areas to work on are {improvement_text} and {missing_text}.

WHAT TO LEARN FIRST:
Start with the highest-priority missing skills, then strengthen the skills marked for improvement through practical exercises and projects.

PLACEMENT ADVICE:
Build practical projects, practice interview questions, and be prepared to explain how you used your technical skills.

NEXT 3 ACTIONS:
1. Start learning the highest-priority missing skill.
2. Build one small practical project using the skill.
3. Re-run the analysis after improving your skills."""

    prompt = f"""
You are an AI career guidance assistant helping a college student prepare for placements.

TARGET ROLE:
{role}

READINESS SCORE:
{score}%

STRONG SKILLS:
{strong_text}

SKILLS TO IMPROVE:
{improvement_text}

MISSING SKILLS:
{missing_text}

Write a concise and personalized career assessment.

IMPORTANT RULES:
- Use ONLY the skills listed above.
- Never invent additional skills.
- NEVER repeat a skill.
- Mention each skill at most once in the entire response.
- Do not repeat sentences.
- Do not repeat the same information in multiple sections.
- Give practical advice suitable for a college student preparing for placements.
- Keep the explanation under 220 words.
- Use plain English.
- Do not use Markdown symbols.
- Do not use #, *, bullets, or tables.

Use EXACTLY these section headings:

CURRENT READINESS:
STRENGTHS:
IMPORTANT GAPS:
WHAT TO LEARN FIRST:
PLACEMENT ADVICE:
NEXT 3 ACTIONS:

For NEXT 3 ACTIONS, write exactly three short numbered actions.
"""

    ai_result = _call_ollama(prompt)

    if ai_result:
        return ai_result

    return fallback