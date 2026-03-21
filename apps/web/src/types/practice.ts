export type PracticeModuleId = 'sql' | 'python' | 'data-modeling' | 'pipeline-builder';

export type DifficultyBand = 'Foundations' | 'Intermediate' | 'Advanced';
export type FeedbackState = 'idle' | 'running' | 'success' | 'validationError' | 'executionError' | 'locked';

export type PracticeModuleSummary = {
  id: PracticeModuleId;
  title: string;
  description: string;
  interviewSkill: string;
  taskShape: string;
  difficultyRange: string;
  href: string;
  tags: string[];
  ctaLabel: string;
};

export type ExerciseSummary = {
  id: string;
  module: PracticeModuleId;
  title: string;
  difficulty: DifficultyBand;
  estimatedTime: string;
  tags: string[];
  summary: string;
  recommended?: boolean;
};

export type PromptSection = {
  label: string;
  body: string;
  collapsible?: boolean;
};

export type ResultTab = {
  id: string;
  label: string;
  body: string;
  status?: 'neutral' | 'success' | 'warning';
};

export type ResultPanelModel = {
  status: FeedbackState;
  summary: string;
  tabs: ResultTab[];
  explanation: string;
};

export type ExerciseWorkspaceProps = {
  module: PracticeModuleId;
  exerciseMeta: ExerciseSummary;
  promptSections: PromptSection[];
  starterHint: string;
  saveState: string;
  feedbackState: FeedbackState;
  resultPanel: ResultPanelModel;
  workSurfaceTitle: string;
  workSurfaceDescription: string;
};

export type SchemaColumn = {
  name: string;
  type: string;
  description: string;
};

export type SchemaTable = {
  name: string;
  description: string;
  columns: SchemaColumn[];
  sampleRows: Array<Record<string, number>>;
};

export type SqlExerciseDetail = {
  exercise: ExerciseSummary;
  promptSections: PromptSection[];
  starterHint: string;
  starterSql: string;
  schema: SchemaTable[];
  workSurfaceTitle: string;
  workSurfaceDescription: string;
  saveState: string;
  resultSummary: string;
};

export type DraftAttempt = {
  sql: string;
  updatedAt: string;
};

export type SqlExerciseResponse = {
  exerciseDetail: SqlExerciseDetail;
  draftAttempt: DraftAttempt | null;
  entitlement: {
    canAttempt: boolean;
    plan: string;
  };
};

export type SqlRunResponse = {
  status: FeedbackState;
  summary: string;
  columns: string[];
  rows: Array<Array<number | string | null>>;
  rowCount: number;
  explanation: string;
  error?: {
    code: string;
    message: string;
  } | null;
};

export type SqlSubmitResponse = {
  status: FeedbackState;
  summary: string;
  rubric: {
    correctness: number;
    structure: number;
    efficiencyOrDesign: number;
    overall: number;
  };
  strengths: string[];
  issues: string[];
  nextBestImprovement: string;
  explanation: string;
  outputPreview?: SqlRunResponse | null;
};
