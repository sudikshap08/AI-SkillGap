"""AI-assisted career guidance using local Ollama with safe fallbacks."""

import json
import re
import requests

from ..config import OLLAMA_URL, OLLAMA_MODEL


OLLAMA_TIMEOUT = 45


def _clean_list(items):
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
    if not text:
        return None
    text = text.strip()
    text = re.sub(r"\*\*", "", text)
    text = re.sub(r"^#{1,6}\s*", "", text, flags=re.MULTILINE)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip() or None


def _call_ollama(prompt: str, temperature=0.15, num_predict=450):
    try:
        response = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": temperature,
                    "num_predict": num_predict,
                },
            },
            timeout=OLLAMA_TIMEOUT,
        )
        response.raise_for_status()
        result = response.json().get("response") or ""
        return _clean_ai_output(result)
    except Exception as exc:
        print("Ollama unavailable; using deterministic fallback:", exc)
        return None


def _extract_json(text):
    if not text:
        return None
    candidate = text.strip()
    candidate = re.sub(r"^```(?:json)?\s*", "", candidate, flags=re.I)
    candidate = re.sub(r"\s*```$", "", candidate)
    try:
        return json.loads(candidate)
    except Exception:
        match = re.search(r"\{.*\}", candidate, flags=re.S)
        if not match:
            return None
        try:
            return json.loads(match.group(0))
        except Exception:
            return None


def generate_explanation(role, score, strong, improvement, missing):
    strong = _clean_list(strong)
    improvement = _clean_list(improvement)
    missing = _clean_list(missing)

    strong_text = ", ".join(strong) if strong else "None"
    improvement_text = ", ".join(improvement) if improvement else "None"
    missing_text = ", ".join(missing) if missing else "None"

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

TARGET ROLE: {role}
READINESS SCORE: {score}%
STRONG SKILLS: {strong_text}
SKILLS TO IMPROVE: {improvement_text}
MISSING SKILLS: {missing_text}

Write a concise personalized career assessment. Use ONLY the supplied skills. Never invent or repeat a skill. Keep it under 220 words, plain English, no markdown symbols.

Use EXACTLY these section headings:
CURRENT READINESS:
STRENGTHS:
IMPORTANT GAPS:
WHAT TO LEARN FIRST:
PLACEMENT ADVICE:
NEXT 3 ACTIONS:

For NEXT 3 ACTIONS, write exactly three short numbered actions.
"""

    return _call_ollama(prompt, temperature=0.15, num_predict=450) or fallback


def generate_personalized_guidance(role, score, results, roadmap, projects):
    """Generate a small AI layer that explains priorities and why projects fit.

    The deterministic readiness engine remains the source of truth. Ollama adds
    personalized interpretation instead of inventing the user's skill data.
    """
    results = results or []
    roadmap = roadmap or []
    projects = projects or []

    strong = [r["skill_name"] for r in results if r["status"] == "Strong"]
    improvement = [r["skill_name"] for r in results if r["status"] == "Improvement"]
    missing = [r["skill_name"] for r in results if r["status"] == "Missing"]

    # build_roadmap returns skill_id; resolve it back to the human-readable
    # skill name before building the AI prompt. This prevents a KeyError and
    # keeps the AI layer independent from the roadmap response shape.
    skill_names_by_id = {r["skill_id"]: r["skill_name"] for r in results}
    focus = [
        skill_names_by_id.get(item.get("skill_id"), item.get("skill"))
        for item in roadmap[:5]
    ]
    focus = [name for name in focus if name]

    project_payload = [
        {
            "title": p.title,
            "description": p.description,
            "difficulty": p.difficulty,
            "skills": [ps.skill.name for ps in p.project_skills],
        }
        for p in projects
    ]

    fallback_projects = {}
    gap_names = {x.lower() for x in improvement + missing}
    for p in project_payload:
        covered = [s for s in p["skills"] if s.lower() in gap_names]
        if covered:
            fallback_projects[p["title"]] = (
                f"Build this project to practice {', '.join(covered[:3])} in a practical setting."
            )
        else:
            fallback_projects[p["title"]] = (
                f"Use this {p['difficulty'].lower()} project to turn your current foundation into portfolio evidence."
            )

    fallback = {
        "ai_used": False,
        "summary": (
            f"Your profile shows a foundation in {', '.join(strong[:4]) or 'the skills you entered'} for {role}. "
            f"The main areas holding back your readiness are {', '.join((improvement + missing)[:5]) or 'the highest-impact role skills'}. "
            f"Skills marked for improvement should be strengthened with hands-on practice, while missing skills should be learned from the fundamentals before moving to advanced topics. "
            f"Your immediate focus should be {', '.join(focus[:3]) or 'the highest-impact gaps'}, because these skills can move you closer to the practical requirements of the target role."
        ),
        "learning_strategy": (
            "Start with the highest-impact missing skills, then strengthen improvement areas through small practical tasks. "
            "For each gap, learn the concept, build a project feature using it, and re-run the analysis to measure progress."
        ),
        "project_reasons": fallback_projects,
    }

    prompt = f"""
You are the AI career coach inside a career-readiness application. Your job is to explain the learner's analysis in useful, specific, encouraging language.

TARGET ROLE: {role}
READINESS SCORE: {score}%
STRONG SKILLS: {', '.join(strong) or 'None'}
SKILLS NEEDING IMPROVEMENT: {', '.join(improvement) or 'None'}
MISSING SKILLS: {', '.join(missing) or 'None'}
ROADMAP PRIORITIES: {', '.join(focus) or 'None'}

CANDIDATE PROJECTS:
{json.dumps(project_payload, ensure_ascii=False)}

Return ONLY valid JSON in this exact shape:
{{
  "summary": "4 to 6 sentences that explain the learner's current foundation, the most important improvement areas and missing gaps, why those gaps matter for the target role, and what should be prioritized next.",
  "learning_strategy": "2 to 3 practical sentences explaining exactly how the learner should close the gaps through learning, hands-on practice, and projects.",
  "project_reasons": {{"Project title": "1 to 2 sentences explaining which supplied gap or improvement area this project helps practice and why it is relevant to the target role."}}
}}

Rules:
- Use ONLY skills present in the supplied data.
- Clearly distinguish Strong skills, Improvement skills, and Missing skills.
- Do not say the learner has a skill marked Missing.
- For improvement skills, explain that the learner should strengthen depth, practice, or application.
- For missing skills, explain why learning them matters for the target role and suggest a practical way to start.
- Prefer the roadmap priorities when deciding what to emphasize first.
- Explain gaps rather than merely listing them.
- Do not invent certifications, experience, technologies, employers, or achievements.
- Only use project titles from Candidate projects.
- Do not use percentages other than the supplied readiness value.
- Keep the language simple, specific, and student-friendly.
- Do not use markdown, bullet symbols, headings, or asterisks inside the JSON strings.
"""


    raw = _call_ollama(prompt, temperature=0.2, num_predict=350)
    parsed = _extract_json(raw)
    if not isinstance(parsed, dict):
        return fallback

    summary = str(parsed.get("summary") or "").strip()
    strategy = str(parsed.get("learning_strategy") or "").strip()
    reasons = parsed.get("project_reasons")
    if not isinstance(reasons, dict):
        reasons = {}

    valid_titles = {p["title"] for p in project_payload}
    clean_reasons = {
        title: str(reason).strip()
        for title, reason in reasons.items()
        if title in valid_titles and str(reason).strip()
    }

    return {
        "ai_used": True,
        "summary": summary or fallback["summary"],
        "learning_strategy": strategy or fallback["learning_strategy"],
        "project_reasons": {**fallback_projects, **clean_reasons},
    }
