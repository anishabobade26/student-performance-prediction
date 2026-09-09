from typing import Dict, Any, List


def generate_recommendations(
    student_data: Dict[str, Any],
    predicted_g3: float,
    pass_probability: float,
    risk_level: str
) -> List[Dict[str, Any]]:
    """
    Generates tailored, prioritized, actionable AI recommendations based on
    student feature profile, predicted score, risk assessment, and key bottlenecks.
    """
    recommendations: List[Dict[str, Any]] = []

    studytime = int(student_data.get("studytime", 2))
    failures = int(student_data.get("failures", 0))
    absences = int(student_data.get("absences", 0))
    g1 = float(student_data.get("G1", 10))
    g2 = float(student_data.get("G2", 10))
    schoolsup = str(student_data.get("schoolsup", "no")).lower()
    famsup = str(student_data.get("famsup", "no")).lower()
    paid = str(student_data.get("paid", "no")).lower()
    dalc = int(student_data.get("Dalc", 1))
    walc = int(student_data.get("Walc", 1))
    freetime = int(student_data.get("freetime", 3))
    goout = int(student_data.get("goout", 3))
    higher = str(student_data.get("higher", "yes")).lower()

    # 1. Study Time Strategy
    if studytime <= 2:
        priority = "High" if predicted_g3 < 12 else "Medium"
        recommendations.append({
            "id": "rec_study_time",
            "category": "Academic Strategy",
            "title": "Scale Weekly Focused Study Routine",
            "priority": priority,
            "expected_impact": "+1.5 to +2.5 Grade Points",
            "description": f"Currently allocating {studytime * 2.5:.0f} hrs/week. Increasing to 5-10 hours/week (study time level 3+) with structured Pomodoro blocks.",
            "action_steps": [
                "Schedule two 90-minute deep-work study blocks on weekdays.",
                "Dedicate 3 hours on Saturday morning for chapter summaries.",
                "Review lecture notes within 24 hours of class."
            ],
            "target_metric": "Weekly Study Time -> 3+ (5-10 hours)"
        })

    # 2. Attendance & Absenteeism Intervention
    if absences >= 6:
        priority = "High" if absences > 10 or predicted_g3 < 10 else "Medium"
        recommendations.append({
            "id": "rec_attendance",
            "category": "Attendance & Engagement",
            "title": "Mitigate School Absenteeism",
            "priority": priority,
            "expected_impact": "+1.0 to +2.0 Grade Points",
            "description": f"Current absence count is {absences} days. Missed classes disrupt core concept continuity and directly diminish G3 performance.",
            "action_steps": [
                "Set strict target to cap future unexcused absences to 0.",
                "Request peer or teacher notes for previous missed sessions.",
                "Schedule teacher office-hour check-ins for missed syllabus topics."
            ],
            "target_metric": f"Absences -> Reduce from {absences} to < 4"
        })

    # 3. Grade Trajectory & Weak Spot Recovery
    if g2 < g1 or g2 < 10:
        recommendations.append({
            "id": "rec_grade_recovery",
            "category": "Curriculum Mastery",
            "title": "Targeted Remediation on Period 2 Concepts",
            "priority": "High",
            "expected_impact": "+2.0 to +3.0 Grade Points",
            "description": f"Recent period grade (G2: {g2}) indicates specific topic gaps that need immediate diagnostic testing.",
            "action_steps": [
                "Perform an audit on missed questions from Period 1 and 2 exams.",
                "Solve 3 past final exam papers under timed conditions.",
                "Create active recall flashcards for foundational formulas and theorems."
            ],
            "target_metric": "Period 2 Gap Resolution -> 100% Remediation"
        })

    # 4. Academic Support & Tutoring
    if (schoolsup == "no" or paid == "no") and (predicted_g3 < 12 or failures > 0):
        recommendations.append({
            "id": "rec_academic_support",
            "category": "Support Systems",
            "title": "Leverage Supplemental Educational Support",
            "priority": "High" if failures > 0 else "Medium",
            "expected_impact": "+1.0 to +2.0 Grade Points",
            "description": "Utilizing school tutoring programs or targeted mentoring significantly reduces exam anxiety and clarifies complex problem-solving.",
            "action_steps": [
                "Enroll in after-school remedial sessions or peer study circles.",
                "Join an active online problem-solving group for mathematics/language.",
                "Participate in weekly group mock test reviews."
            ],
            "target_metric": "Support System -> Active Participation"
        })

    # 5. Lifestyle & Social Balance
    if (dalc + walc) >= 5 or (freetime >= 4 and goout >= 4):
        recommendations.append({
            "id": "rec_lifestyle_balance",
            "category": "Lifestyle & Wellness",
            "title": "Optimize Daily Routine & Sleep Schedule",
            "priority": "Medium",
            "expected_impact": "+0.8 to +1.5 Grade Points",
            "description": "High social frequency and weekend alcohol consumption interfere with cognitive memory consolidation and study consistency.",
            "action_steps": [
                "Establish a consistent 7.5 - 8 hour nightly sleep routine.",
                "Limit high-stimulation weekend outings prior to exam periods.",
                "Designate Sunday evenings for weekly schedule planning and mental prep."
            ],
            "target_metric": "Lifestyle Index -> Balanced Study-Life Ratio"
        })

    # 6. Advanced Enrichment for High Performers
    if predicted_g3 >= 15:
        recommendations.append({
            "id": "rec_excellence",
            "category": "Academic Excellence",
            "title": "Advanced Problem Solving & Distinction Prep",
            "priority": "Low",
            "expected_impact": "+1.0 to +2.0 Grade Points (Push for 18-20)",
            "description": "Outstanding trajectory! Solidify top-tier mastery by engaging with competition-level exercises and mentoring peers.",
            "action_steps": [
                "Attempt challenging Olympiad / Advanced Placement difficulty problem sets.",
                "Lead a weekly study group to reinforce conceptual depth through teaching.",
                "Build an academic portfolio for university and scholarship applications."
            ],
            "target_metric": "Final Grade Target -> 18.0+ / 20.0"
        })

    # Enrichment fallbacks to guarantee at least 3 actionable recommendations
    fallback_pool = [
        {
            "id": "rec_exam_simulation",
            "category": "Exam Strategy",
            "title": "Timed Mock Exam Simulation",
            "priority": "Medium",
            "expected_impact": "+1.0 Grade Point",
            "description": "Simulating actual test conditions minimizes exam day cognitive fatigue and sharpens time management.",
            "action_steps": [
                "Complete full 2-hour practice exams without external notes.",
                "Analyze time spent per section and refine answer allocation strategy.",
                "Review scoring rubrics to maximize partial credit."
            ],
            "target_metric": "Mock Exams Completed -> 3 Full Papers"
        },
        {
            "id": "rec_active_recall",
            "category": "Cognitive Techniques",
            "title": "Active Recall & Spaced Repetition",
            "priority": "Medium",
            "expected_impact": "+1.2 Grade Points",
            "description": "Employing spaced repetition intervals dramatically enhances long-term retention of complex curricula.",
            "action_steps": [
                "Convert lecture slides into question-and-answer flashcard decks.",
                "Review cards at 1-day, 3-day, and 7-day intervals before major assessments.",
                "Self-test without looking at solutions before verifying answers."
            ],
            "target_metric": "Retention Rate -> 90%+ on Recall Drills"
        },
        {
            "id": "rec_peer_collaboration",
            "category": "Peer Learning",
            "title": "Structured Peer Discussion Circles",
            "priority": "Low",
            "expected_impact": "+0.8 Grade Point",
            "description": "Explaining complex concepts to peers reveals subtle misconceptions and builds exam confidence.",
            "action_steps": [
                "Organize a weekly 60-minute problem-solving session with 2-3 classmates.",
                "Take turns presenting solutions to difficult textbook exercises.",
                "Compile a shared repository of challenging practice problems."
            ],
            "target_metric": "Peer Study Frequency -> 1 session / week"
        }
    ]

    existing_ids = {r["id"] for r in recommendations}
    for fb in fallback_pool:
        if len(recommendations) >= 3:
            break
        if fb["id"] not in existing_ids:
            recommendations.append(fb)
            existing_ids.add(fb["id"])

    return recommendations[:5]
