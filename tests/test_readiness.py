from backend.services.readiness_engine import calculate_score

def test_weighted_score():
    rows = [
        {"importance": 2, "value": 1},
        {"importance": 1, "value": 0.5},
        {"importance": 1, "value": 0}
    ]
    assert calculate_score(rows) == 62.5
