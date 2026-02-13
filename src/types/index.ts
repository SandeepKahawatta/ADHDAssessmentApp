export interface QuestionnaireInput {
  child_id: string;
  source: 'parent' | 'teacher';
  responses: number[]; // List of 18 integers (0-3)
}

export interface GameDataInput {
  child_id: string;
  avg_reaction_time: number;
  reaction_time_std: number;
  accuracy_rate: number;
  impulsivity_error_rate: number;
  focus_consistency_score: number;
  task_completion_ratio: number;
}

export interface SubjectiveResult {
  type: string;
  score: number;
  details: {
    inattention: number;
    hyperactivity: number;
  };
}

export interface QuestionnaireResponse {
  status: string;
  source: string;
  result: SubjectiveResult;
}

export interface ObjectiveResult {
  type: string;
  score: number;
}

export interface GameDataResponse {
  status: string;
  objective_result: ObjectiveResult;
}

export interface FinalDiagnosis {
  status: string;
  message: string;
  breakdown: {
    parent_observation: string;
    teacher_observation: string;
    objective_result: string;
  };
}

export interface FinalResultResponse {
  child_id: string;
  final_diagnosis: FinalDiagnosis;
  next_step: string;
}

export interface PendingResultResponse {
  status: string;
  message: string;
  completed_steps: string[];
}
