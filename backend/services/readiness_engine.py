def classify(required, user_skill):
    if not user_skill:
        return "Missing", 0.0
    level = user_skill.level.lower()
    if level in {"improvement", "beginner", "basic", "learning"}:
        return "Improvement", 0.5
    return "Strong", 1.0

def calculate_score(results):
    total_weight = sum(x["importance"] for x in results) or 1
    weighted = sum(x["value"] * x["importance"] for x in results)
    return round(weighted / total_weight * 100, 1)
