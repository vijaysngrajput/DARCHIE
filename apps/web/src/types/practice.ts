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
