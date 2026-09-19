def build_roadmap(gaps, prerequisite_map, status_by_id=None):
    """Build an ordered roadmap from gaps, recursively adding only unmet prerequisites."""
    status_by_id = status_by_id or {}
    ordered = sorted(gaps, key=lambda x: x["importance"], reverse=True)
    output, seen = [], set()

    def add_chain(skill_id, reason, difficulty="Intermediate"):
        if not skill_id or skill_id in seen:
            return
        prereq = prerequisite_map.get(skill_id)
        if prereq and prereq not in seen and status_by_id.get(prereq) != "Strong":
            add_chain(prereq, "Learn this prerequisite first so the next skill is easier to understand.", "Beginner")
        seen.add(skill_id)
        output.append({"skill_id": skill_id, "reason": reason, "difficulty": difficulty})

    for gap in ordered:
        add_chain(gap["skill_id"], gap["reason"], "Intermediate" if gap["status"] == "Improvement" else "Beginner")

    for i, item in enumerate(output):
        item["phase"] = i // 2 + 1
    return output
