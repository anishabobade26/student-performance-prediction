"""
End-to-End System Integration Test Suite
Verifies the running FastAPI backend and ML engine via real HTTP requests.
"""
import requests
import json
import io
import sys

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_URL = "http://localhost:8000"

def run_e2e_checks():
    print("=" * 75)
    print("      STUDENT PERFORMANCE AI - END-TO-END SYSTEM INTEGRATION SUITE")
    print("=" * 75)
    
    session = requests.Session()
    
    # 1. Health Probe
    print("\n[1/8] Probing System Health (/health)...")
    try:
        r = session.get(f"{BASE_URL}/health")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        health_data = r.json()
        print(f"  [PASS] Status: {health_data.get('status')} | Service: {health_data.get('service')}")
    except Exception as e:
        print(f"  [FAIL] Health check failed: {e}")
        return False

    # 2. Presets Endpoint
    print("\n[2/8] Fetching Pre-Configured Student Presets (/api/v1/presets)...")
    try:
        r = session.get(f"{BASE_URL}/api/v1/presets")
        assert r.status_code == 200, f"Expected 200, got {r.status_code}"
        presets = r.json()
        assert len(presets) >= 4, f"Expected at least 4 presets, got {len(presets)}"
        print(f"  [PASS] Successfully retrieved {len(presets)} curated demo presets:")
        for p in presets:
            print(f"    - {p.get('name')} | Tag: {p.get('tag')} | G1={p.get('data', {}).get('G1')}, G2={p.get('data', {}).get('G2')}")
    except Exception as e:
        print(f"  [FAIL] Presets endpoint failed: {e}")
        return False

    # 3. Authentication (Admin & Student)
    print("\n[3/8] Authenticating User (/api/v1/auth/login)...")
    auth_token = None
    try:
        login_payload = {"username": "admin", "password": "Admin@12345"}
        r = session.post(f"{BASE_URL}/api/v1/auth/login", json=login_payload)
        assert r.status_code == 200, f"Login failed: {r.status_code} - {r.text}"
        auth_data = r.json()
        auth_token = auth_data.get("access_token")
        assert auth_token, "No access token in response"
        print(f"  [PASS] Admin authenticated. User: {auth_data.get('user', {}).get('username')} | Email: {auth_data.get('user', {}).get('email')}")
        
        # Test /api/v1/auth/me
        headers = {"Authorization": f"Bearer {auth_token}"}
        r_me = session.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
        assert r_me.status_code == 200
        print(f"  [PASS] Profile retrieved via Bearer JWT: Role={r_me.json().get('role')}")
    except Exception as e:
        print(f"  [FAIL] Authentication failed: {e}")
        return False

    # 4. Single Prediction + SHAP + LIME + Recommendations
    print("\n[4/8] Executing ML Inference & Dual XAI Analysis (/api/v1/predict)...")
    headers = {"Authorization": f"Bearer {auth_token}"} if auth_token else {}
    sample_student = {
        "school": "GP", "sex": "F", "age": 17, "address": "U", "famsize": "GT3", "Pstatus": "T",
        "Medu": 4, "Fedu": 4, "Mjob": "health", "Fjob": "teacher", "reason": "course", "guardian": "mother",
        "traveltime": 1, "studytime": 3, "failures": 0, "schoolsup": "no", "famsup": "yes", "paid": "yes",
        "activities": "yes", "nursery": "yes", "higher": "yes", "internet": "yes", "romantic": "no",
        "famrel": 5, "freetime": 3, "goout": 2, "Dalc": 1, "Walc": 1, "health": 5, "absences": 2,
        "G1": 15.0, "G2": 16.0
    }
    try:
        r = session.post(f"{BASE_URL}/api/v1/predict", json=sample_student, headers=headers)
        assert r.status_code == 200, f"Prediction failed: {r.status_code} - {r.text}"
        pred = r.json()
        print(f"  [PASS] Predicted Grade (G3): {pred.get('predicted_g3')} / 20 ({pred.get('predicted_percentage')}%) | Tier: {pred.get('performance_tier')}")
        print(f"  [PASS] Classification: {pred.get('pass_fail')} (Pass Prob: {round(pred.get('pass_probability', 0) * 100, 1)}%) | Risk: {pred.get('risk_level')}")
        print(f"  [PASS] Confidence Score: {pred.get('confidence_score')}% | Inference Latency: {pred.get('latency_ms')} ms")
        print(f"  [PASS] Top Positive Shapley Factors: {[f.get('feature') for f in pred.get('top_positive_factors', [])[:3]]}")
        print(f"  [PASS] LIME Surrogate Rules Generated: {len(pred.get('lime_explanations', []))} local rules")
        print(f"  [PASS] Dynamic Natural Language Insights: {len(pred.get('human_readable_insights', []))} points")
        print(f"  [PASS] Prescriptive Action Items: {len(pred.get('recommendations', []))} prioritized strategies")
    except Exception as e:
        print(f"  [FAIL] Single prediction failed: {e}")
        return False

    # 5. High-Throughput Batch Prediction
    print("\n[5/8] Processing Multi-Student Vectorized Batch (/api/v1/batch-predict)...")
    try:
        csv_content = """school,sex,age,address,famsize,Pstatus,Medu,Fedu,Mjob,Fjob,reason,guardian,traveltime,studytime,failures,schoolsup,famsup,paid,activities,nursery,higher,internet,romantic,famrel,freetime,goout,Dalc,Walc,health,absences,G1,G2
GP,F,16,U,GT3,T,4,4,health,services,home,mother,1,4,0,no,yes,yes,yes,yes,yes,yes,no,5,2,2,1,1,5,0,18,18
GP,M,17,U,LE3,T,2,2,other,other,course,father,2,1,2,yes,no,no,no,yes,no,yes,yes,3,4,4,3,4,2,14,7,8
MS,F,18,R,GT3,A,1,1,at_home,other,reputation,mother,3,2,1,no,yes,no,no,no,yes,no,no,4,3,3,1,2,4,6,10,11
GP,F,15,U,GT3,T,3,3,services,services,home,mother,1,3,0,no,yes,no,yes,yes,yes,yes,no,4,3,2,1,1,4,2,14,15
MS,M,19,R,LE3,T,1,2,other,at_home,course,other,2,1,3,no,no,no,no,yes,no,no,no,2,5,5,4,5,1,22,5,6
"""
        files = {"file": ("student_cohort_sample.csv", io.BytesIO(csv_content.encode("utf-8")), "text/csv")}
        r = session.post(f"{BASE_URL}/api/v1/batch-predict", files=files, headers=headers)
        assert r.status_code == 200, f"Batch predict failed: {r.status_code} - {r.text}"
        batch_res = r.json()
        print(f"  [PASS] Total Records Scored: {batch_res.get('total_students')} students | Latency: {batch_res.get('processing_time_seconds')}s")
        print(f"  [PASS] Pass/Fail Breakdown: {batch_res.get('passed_count')} Passed ({batch_res.get('pass_rate_percentage')}%), {batch_res.get('failed_count')} Failed")
        print(f"  [PASS] Cohort Average Predicted Grade: {batch_res.get('average_predicted_grade')} / 20 | High-Risk Flagged: {batch_res.get('high_risk_count')}")
        
        # Test download endpoint
        download_url = batch_res.get('download_url')
        if download_url:
            r_dl = session.get(f"{BASE_URL}{download_url}")
            assert r_dl.status_code == 200
            print(f"  [PASS] Downloaded Annotated CSV Report: {len(r_dl.content)} bytes")
    except Exception as e:
        print(f"  [FAIL] Batch prediction failed: {e}")
        return False

    # 6. Analytics Overview & ML Leaderboard
    print("\n[6/8] Fetching Cohort Analytics & ML Leaderboard (/api/v1/analytics/overview)...")
    try:
        r = session.get(f"{BASE_URL}/api/v1/analytics/overview")
        assert r.status_code == 200, f"Analytics overview failed: {r.status_code} - {r.text}"
        analytics = r.json()
        print(f"  [PASS] Historical Cohort Population: {analytics.get('total_predictions')} evaluations | Pass Rate: {analytics.get('overall_pass_rate')}%")
        print(f"  [PASS] Grade Distribution Bins: {len(analytics.get('grade_distribution', []))} categories")
        print(f"  [PASS] Study Time Categories: {len(analytics.get('study_time_analysis', []))} categories")
        print(f"  [PASS] ML Leaderboard Models Benchmark: {len(analytics.get('leaderboard', []))} algorithms")
        for m in analytics.get('leaderboard', [])[:3]:
            champ = " [CHAMPION]" if m.get('is_champion') else ""
            print(f"    * {m.get('model_name')}{champ}: R²={m.get('r2_score')}, RMSE={m.get('rmse')}, CV Mean={m.get('cv_r2_mean')}")
    except Exception as e:
        print(f"  [FAIL] Analytics overview failed: {e}")
        return False

    # 7. Prediction History & Audit Trail
    print("\n[7/8] Querying Prediction Audit Log (/api/v1/history)...")
    try:
        r = session.get(f"{BASE_URL}/api/v1/history?limit=10", headers=headers)
        assert r.status_code == 200, f"History failed: {r.status_code} - {r.text}"
        history = r.json()
        preds = history.get('predictions', [])
        print(f"  [PASS] Retrieved {len(preds)} persistent prediction audit records (Total in DB: {history.get('total')})")
    except Exception as e:
        print(f"  [FAIL] History audit endpoint failed: {e}")
        return False

    # 8. Admin Model Status & User Registry
    print("\n[8/8] Checking Admin Statistics & User Registry (/api/v1/admin/stats)...")
    try:
        r_stats = session.get(f"{BASE_URL}/api/v1/admin/stats", headers=headers)
        assert r_stats.status_code == 200, f"Admin stats failed: {r_stats.status_code}"
        stats = r_stats.json()
        print(f"  [PASS] Registered Users: {stats.get('total_users')} | Total Predictions Logged: {stats.get('total_predictions')}")
        print(f"  [PASS] Active Model Version: {stats.get('active_model_version')} | Champion Algorithm: {stats.get('champion_model')}")
        
        r_users = session.get(f"{BASE_URL}/api/v1/admin/users", headers=headers)
        assert r_users.status_code == 200
        print(f"  [PASS] Admin User Access: Verified ({len(r_users.json())} user accounts active)")
    except Exception as e:
        print(f"  [FAIL] Admin endpoint failed: {e}")
        return False

    print("\n" + "=" * 75)
    print("  🎉 ALL 8/8 END-TO-END SYSTEM INTEGRATION TESTS PASSED WITH 100% SUCCESS!")
    print("=" * 75)
    return True

if __name__ == "__main__":
    success = run_e2e_checks()
    sys.exit(0 if success else 1)
