export interface StudentData {
  school: 'GP' | 'MS';
  sex: 'F' | 'M';
  age: number;
  address: 'U' | 'R';
  famsize: 'LE3' | 'GT3';
  Pstatus: 'T' | 'A';
  Medu: number;
  Fedu: number;
  Mjob: 'teacher' | 'health' | 'services' | 'at_home' | 'other';
  Fjob: 'teacher' | 'health' | 'services' | 'at_home' | 'other';
  reason: 'home' | 'reputation' | 'course' | 'other';
  guardian: 'mother' | 'father' | 'other';
  traveltime: number;
  studytime: number;
  failures: number;
  schoolsup: 'yes' | 'no';
  famsup: 'yes' | 'no';
  paid: 'yes' | 'no';
  activities: 'yes' | 'no';
  nursery: 'yes' | 'no';
  higher: 'yes' | 'no';
  internet: 'yes' | 'no';
  romantic: 'yes' | 'no';
  famrel: number;
  freetime: number;
  goout: number;
  Dalc: number;
  Walc: number;
  health: number;
  absences: number;
  G1: number;
  G2: number;
}

export interface FeatureImpact {
  feature: string;
  raw_feature_name: string;
  impact: number;
  direction: 'positive' | 'negative';
  magnitude: number;
}

export interface LimeItem {
  rule: string;
  weight: number;
}

export interface Recommendation {
  id: string;
  category: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  expected_impact: string;
  description: string;
  action_steps: string[];
  target_metric: string;
}

export interface PredictionResult {
  prediction_id?: number;
  predicted_g3: number;
  predicted_percentage: number;
  pass_fail: 'Pass' | 'Fail';
  pass_probability: number;
  risk_level: 'Low' | 'Medium' | 'High' | 'Critical';
  confidence_score: number;
  performance_tier: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  model_version: string;
  champion_regressor: string;
  champion_classifier: string;
  top_features: FeatureImpact[];
  top_positive_factors: FeatureImpact[];
  top_negative_factors: FeatureImpact[];
  lime_explanations: LimeItem[];
  human_readable_insights: string[];
  recommendations: Recommendation[];
  baseline_expected_value: number;
  latency_ms: number;
  created_at: string;
}

export interface PresetStudent {
  name: string;
  description: string;
  tag: string;
  data: StudentData;
}

export interface BatchItem {
  row_index: number;
  predicted_g3: number;
  pass_fail: string;
  risk_level: string;
  pass_probability: number;
  performance_tier: string;
  top_recommendation: string;
}

export interface BatchResult {
  batch_id: string;
  total_students: number;
  passed_count: number;
  failed_count: number;
  pass_rate_percentage: number;
  average_predicted_grade: number;
  high_risk_count: number;
  predictions: BatchItem[];
  download_url?: string;
  processing_time_seconds: number;
}

export interface GradeDistributionBin {
  grade_range: string;
  count: number;
  percentage: number;
}

export interface StudyTimeVsGrade {
  study_time_category: string;
  average_grade: number;
  student_count: number;
  pass_rate: number;
}

export interface AbsencesVsGrade {
  absence_bucket: string;
  average_grade: number;
  failure_rate: number;
}

export interface CorrelationItem {
  feature_x: string;
  feature_y: string;
  correlation: number;
}

export interface RiskDistributionItem {
  risk_level: string;
  count: number;
  percentage: number;
}

export interface DemographicsSummary {
  male_count: number;
  female_count: number;
  urban_count: number;
  rural_count: number;
  school_gp_count: number;
  school_ms_count: number;
}

export interface LeaderboardItem {
  model_name: string;
  r2_score: number;
  rmse: number;
  mae: number;
  cv_r2_mean: number;
  fit_time_seconds: number;
  is_champion: boolean;
}

export interface AnalyticsData {
  total_predictions: number;
  average_predicted_grade: number;
  overall_pass_rate: number;
  high_risk_percentage: number;
  model_r2_score: number;
  grade_distribution: GradeDistributionBin[];
  study_time_analysis: StudyTimeVsGrade[];
  absences_analysis: AbsencesVsGrade[];
  risk_distribution: RiskDistributionItem[];
  top_correlations: CorrelationItem[];
  demographics: DemographicsSummary;
  leaderboard: LeaderboardItem[];
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface PredictionHistoryItem {
  id: number;
  student_data: StudentData;
  predicted_g3: number;
  pass_fail: string;
  pass_probability: number;
  risk_level: string;
  confidence_score: number;
  performance_tier: string;
  model_version: string;
  created_at: string;
}
