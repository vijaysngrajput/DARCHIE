import type {
  DataModelingWorkspaceState,
  ExerciseSummary,
  ExerciseWorkspaceProps,
  PracticeModuleId,
  PracticeModuleSummary,
} from '@/types/practice';

export const practiceModules: PracticeModuleSummary[] = [
  {
    id: 'sql',
    title: 'SQL',
    description: 'Work through schema-aware interview questions with execution thinking, not only syntax recall.',
    interviewSkill: 'Query reasoning, joins, windows, debugging, and result validation.',
    taskShape: 'Editor-based exercises with schema context and structured feedback.',
    difficultyRange: 'Foundations to advanced analytics',
    href: '/app/practice/sql',
    tags: ['Schemas', 'Windows', 'Debugging'],
    ctaLabel: 'Open module',
  },
  {
    id: 'python',
    title: 'Python',
    description: 'Practice ETL-style transformation tasks that test clarity, correctness, and edge-case handling.',
    interviewSkill: 'Data cleaning, parsing, transformation, validation, and test-driven thinking.',
    taskShape: 'Code workspace with examples, expected outputs, and review-first results.',
    difficultyRange: 'Foundations to production-style tasks',
    href: '/app/practice/python',
    tags: ['ETL', 'Parsing', 'Validation'],
    ctaLabel: 'Open module',
  },
  {
    id: 'data-modeling',
    title: 'Data Modeling',
    description: 'Map entities, keys, and relationships in a way that shows design judgment under interview pressure.',
    interviewSkill: 'Entity design, grain, constraints, cardinality, and tradeoff explanation.',
    taskShape: 'Visual canvas with entity structure, relationships, and validation cues.',
    difficultyRange: 'Concepts to real design tradeoffs',
    href: '/app/practice/data-modeling',
    tags: ['ERD', 'Keys', 'Normalization'],
    ctaLabel: 'Open module',
  },
  {
    id: 'pipeline-builder',
    title: 'Pipeline Builder',
    description: 'Design ingestion and transformation workflows with orchestration, observability, and failure handling in view.',
    interviewSkill: 'Dependency ordering, retries, quality checks, and execution reasoning.',
    taskShape: 'Node-based visual builder with validation and simulation-oriented feedback.',
    difficultyRange: 'Conceptual to orchestration-heavy',
    href: '/app/practice/pipeline-builder',
    tags: ['ETL', 'Orchestration', 'Observability'],
    ctaLabel: 'Open module',
  },
];

export const moduleExerciseMap: Record<PracticeModuleId, ExerciseSummary[]> = {
  sql: [
    {
      id: 'session-retention-breakdown',
      module: 'sql',
      title: 'Session retention breakdown',
      difficulty: 'Foundations',
      estimatedTime: '25 min',
      tags: ['Window functions', 'Retention', 'Joins'],
      summary: 'Write a query that traces returning-user retention by signup cohort and active week.',
      recommended: true,
    },
    {
      id: 'order-anomaly-audit',
      module: 'sql',
      title: 'Order anomaly audit',
      difficulty: 'Intermediate',
      estimatedTime: '35 min',
      tags: ['CTEs', 'Debugging', 'Data quality'],
      summary: 'Identify duplicates, negative revenue rows, and broken order-state transitions.',
    },
    {
      id: 'revenue-waterfall',
      module: 'sql',
      title: 'Revenue waterfall reconstruction',
      difficulty: 'Advanced',
      estimatedTime: '45 min',
      tags: ['Attribution', 'Aggregations', 'Tradeoffs'],
      summary: 'Rebuild a multi-stage revenue view while preserving clear intermediate logic.',
    },
  ],
  python: [
    {
      id: 'events-normalization-job',
      module: 'python',
      title: 'Events normalization job',
      difficulty: 'Foundations',
      estimatedTime: '30 min',
      tags: ['Parsing', 'Validation', 'Lists'],
      summary: 'Clean and normalize raw event payloads into a stable analytics-ready structure.',
      recommended: true,
    },
    {
      id: 'partner-feed-reconciliation',
      module: 'python',
      title: 'Partner feed reconciliation',
      difficulty: 'Intermediate',
      estimatedTime: '40 min',
      tags: ['Diffing', 'Validation', 'Exceptions'],
      summary: 'Compare two partner datasets and flag mismatches with a clean error summary.',
    },
    {
      id: 'incremental-transform-runner',
      module: 'python',
      title: 'Incremental transform runner',
      difficulty: 'Advanced',
      estimatedTime: '50 min',
      tags: ['State', 'Pipelines', 'Testing'],
      summary: 'Implement an incremental processing flow with idempotent update behavior.',
    },
  ],
  'data-modeling': [
    {
      id: 'marketplace-core-entities',
      module: 'data-modeling',
      title: 'Marketplace core entities',
      difficulty: 'Foundations',
      estimatedTime: '25 min',
      tags: ['ERD', 'Cardinality', 'Keys'],
      summary: 'Model listings, sellers, buyers, and transactions for a growing marketplace.',
      recommended: true,
    },
    {
      id: 'subscription-warehouse-grain',
      module: 'data-modeling',
      title: 'Subscription warehouse grain',
      difficulty: 'Intermediate',
      estimatedTime: '35 min',
      tags: ['Facts', 'Dimensions', 'Grain'],
      summary: 'Choose fact/dimension boundaries for billing, usage, and plan-change reporting.',
    },
    {
      id: 'customer-360-tradeoffs',
      module: 'data-modeling',
      title: 'Customer 360 tradeoffs',
      difficulty: 'Advanced',
      estimatedTime: '45 min',
      tags: ['Normalization', 'History', 'Tradeoffs'],
      summary: 'Balance normalized operational data against analytics-ready access patterns.',
    },
  ],
  'pipeline-builder': [
    {
      id: 'daily-orders-etl',
      module: 'pipeline-builder',
      title: 'Daily orders ETL',
      difficulty: 'Foundations',
      estimatedTime: '30 min',
      tags: ['Dependencies', 'Checks', 'Scheduling'],
      summary: 'Compose a daily ingestion pipeline with validation, transform, and warehouse load steps.',
      recommended: true,
    },
    {
      id: 'sla-aware-alerting-flow',
      module: 'pipeline-builder',
      title: 'SLA-aware alerting flow',
      difficulty: 'Intermediate',
      estimatedTime: '40 min',
      tags: ['Alerts', 'Retries', 'Observability'],
      summary: 'Model a pipeline that retries safely and escalates when freshness SLAs are missed.',
    },
    {
      id: 'multi-source-fan-in',
      module: 'pipeline-builder',
      title: 'Multi-source fan-in orchestration',
      difficulty: 'Advanced',
      estimatedTime: '50 min',
      tags: ['Joins', 'Branching', 'Failure modes'],
      summary: 'Coordinate multiple source streams into one downstream mart with guardrails.',
    },
  ],
};

const workspaceMap: Record<PracticeModuleId, Record<string, ExerciseWorkspaceProps>> = {
  sql: {
    'session-retention-breakdown': {
      module: 'sql',
      exerciseMeta: moduleExerciseMap.sql[0],
      promptSections: [
        { label: 'Prompt', body: 'Write a query that returns weekly retention by signup cohort for active users in the first eight weeks after signup.' },
        { label: 'Constraints', body: 'Assume duplicate events exist, users can reactivate, and the final answer must be readable enough for an interviewer to follow.', collapsible: true },
        { label: 'Expected skills', body: 'Window functions, cohort logic, deduplication, and communicating tradeoffs.', collapsible: true },
      ],
      starterHint: 'Start by isolating the first valid signup week per user, then layer active weeks after deduplication.',
      saveState: 'Draft autosaved 18 seconds ago',
      feedbackState: 'idle',
      resultPanel: {
        status: 'idle',
        summary: 'Run the query to inspect shaped output before submitting.',
        tabs: [
          { id: 'output', label: 'Output', body: 'Sample result rows will appear here after a run.' },
          { id: 'tests', label: 'Checks', body: 'Cohort coverage and deduplication checks will appear here.' },
          { id: 'explanation', label: 'Explanation', body: 'A concise reasoning review will appear after submission.' },
        ],
        explanation: 'Keep intermediate logic legible. This workspace is designed to feel like an interview round, not a coding puzzle only.',
      },
      workSurfaceTitle: 'SQL editor',
      workSurfaceDescription: 'Use a schema-aware query editor with enough context to reason clearly before you optimize.',
    },
  },
  python: {
    'events-normalization-job': {
      module: 'python',
      exerciseMeta: moduleExerciseMap.python[0],
      promptSections: [
        { label: 'Prompt', body: 'Normalize raw event records into a clean list of analytics-ready dictionaries with stable field names and validation handling.' },
        { label: 'Constraints', body: 'Malformed timestamps should be captured in an error summary. Preserve only the newest event per user-session pair.', collapsible: true },
        { label: 'Expected skills', body: 'Parsing, validation, edge-case handling, and writing transformation logic that is easy to review.', collapsible: true },
      ],
      starterHint: 'Separate normalization from validation so the main flow stays readable during discussion.',
      saveState: 'Draft saved just now',
      feedbackState: 'idle',
      resultPanel: {
        status: 'idle',
        summary: 'Execute the transform to inspect cleaned records and validation notes.',
        tabs: [
          { id: 'output', label: 'Output', body: 'Normalized rows and error summaries will appear here.' },
          { id: 'tests', label: 'Checks', body: 'Hidden edge-case checks will appear here after a run.' },
          { id: 'explanation', label: 'Explanation', body: 'A structure-focused review will appear after submission.' },
        ],
        explanation: 'Interviewers care about readable transformation flow and error handling tradeoffs as much as final correctness.',
      },
      workSurfaceTitle: 'Python transform workspace',
      workSurfaceDescription: 'Shape ETL-style code with examples, edge cases, and a review-oriented result panel.',
    },
  },
  'data-modeling': {
    'marketplace-core-entities': {
      module: 'data-modeling',
      exerciseMeta: moduleExerciseMap['data-modeling'][0],
      promptSections: [
        { label: 'Prompt', body: 'Model the core marketplace entities and relationships required for listings, buyer activity, seller operations, and transactions.' },
        { label: 'Constraints', body: 'Support listing revisions and transaction history without overcomplicating the first-pass interview explanation.', collapsible: true },
        { label: 'Expected skills', body: 'Entity boundaries, keys, relationship clarity, and explaining what belongs in the first iteration.', collapsible: true },
      ],
      starterHint: 'Begin with the minimum durable entities, then add revision or status history only where it changes reporting or integrity.',
      saveState: 'No unsaved changes',
      feedbackState: 'idle',
      resultPanel: {
        status: 'idle',
        summary: 'Validate the model to review relationship clarity and key coverage.',
        tabs: [
          { id: 'validation', label: 'Validation', body: 'Entity and relationship checks will appear here.' },
          { id: 'review', label: 'Review', body: 'Design tradeoffs and modeling notes will appear here.' },
          { id: 'explanation', label: 'Explanation', body: 'Interview-oriented rationale prompts will appear here.' },
        ],
        explanation: 'The strongest answers make the grain and relationship choices easy to narrate while still being structurally sound.',
      },
      workSurfaceTitle: 'ERD canvas',
      workSurfaceDescription: 'Lay out entities, keys, and relationships in a way that feels clear enough to defend in an interview.',
      builderStarterState: createMarketplaceStarterState(),
    },
  },
  'pipeline-builder': {
    'daily-orders-etl': {
      module: 'pipeline-builder',
      exerciseMeta: moduleExerciseMap['pipeline-builder'][0],
      promptSections: [
        { label: 'Prompt', body: 'Assemble a daily ETL flow that ingests raw orders, validates quality, transforms the data, and publishes a warehouse-ready table.' },
        { label: 'Constraints', body: 'Include at least one quality gate and one failure handling path. Avoid invalid cycles.', collapsible: true },
        { label: 'Expected skills', body: 'Dependency design, sequencing, retries, observability, and describing failure implications clearly.', collapsible: true },
      ],
      starterHint: 'Place validation as early as possible, then decide which failures should stop the run versus route to alerting.',
      saveState: 'Draft autosaved 1 minute ago',
      feedbackState: 'idle',
      resultPanel: {
        status: 'idle',
        summary: 'Validate the graph before simulation to inspect pipeline logic and failure handling.',
        tabs: [
          { id: 'validation', label: 'Validation', body: 'Node and edge validation messages will appear here.' },
          { id: 'simulation', label: 'Simulation', body: 'Step-by-step execution notes will appear here.' },
          { id: 'explanation', label: 'Explanation', body: 'Interview-style feedback on pipeline choices will appear here.' },
        ],
        explanation: 'A strong pipeline answer shows what should happen when the happy path breaks, not only how the graph looks.',
      },
      workSurfaceTitle: 'Pipeline canvas',
      workSurfaceDescription: 'Compose sources, transforms, checks, and sinks in one sequence-focused visual workspace.',
    },
  },
};

export function getModuleSummary(moduleId: PracticeModuleId) {
  return practiceModules.find((module) => module.id === moduleId);
}

export function getModuleExercises(moduleId: PracticeModuleId) {
  return moduleExerciseMap[moduleId];
}

export function getWorkspaceExercise(moduleId: PracticeModuleId, exerciseId: string) {
  return workspaceMap[moduleId][exerciseId];
}

function createMarketplaceStarterState(): DataModelingWorkspaceState {
  return {
    version: 1,
    entities: [
      {
        id: 'entity-users',
        name: 'users',
        description: 'Marketplace users can act as buyers, sellers, or both.',
        persistent: true,
        position: { x: 100, y: 120 },
        fields: [
          { id: 'field-users-id', name: 'id', type: 'uuid', primaryKey: true, nullable: false, foreignKey: null },
          { id: 'field-users-role', name: 'role', type: 'string', primaryKey: false, nullable: false, foreignKey: null },
          { id: 'field-users-created', name: 'created_at', type: 'timestamp', primaryKey: false, nullable: false, foreignKey: null },
        ],
      },
      {
        id: 'entity-listings',
        name: 'listings',
        description: 'Active marketplace inventory owned by sellers.',
        persistent: true,
        position: { x: 520, y: 70 },
        fields: [
          { id: 'field-listings-id', name: 'id', type: 'uuid', primaryKey: true, nullable: false, foreignKey: null },
          {
            id: 'field-listings-seller-id',
            name: 'seller_id',
            type: 'uuid',
            primaryKey: false,
            nullable: false,
            foreignKey: { entityId: 'entity-users', fieldId: 'field-users-id' },
          },
          { id: 'field-listings-title', name: 'title', type: 'string', primaryKey: false, nullable: false, foreignKey: null },
          { id: 'field-listings-status', name: 'status', type: 'string', primaryKey: false, nullable: false, foreignKey: null },
        ],
      },
      {
        id: 'entity-orders',
        name: 'orders',
        description: 'Transactions connecting buyers to listed inventory.',
        persistent: true,
        position: { x: 420, y: 360 },
        fields: [
          { id: 'field-orders-id', name: 'id', type: 'uuid', primaryKey: true, nullable: false, foreignKey: null },
          {
            id: 'field-orders-listing-id',
            name: 'listing_id',
            type: 'uuid',
            primaryKey: false,
            nullable: false,
            foreignKey: { entityId: 'entity-listings', fieldId: 'field-listings-id' },
          },
          {
            id: 'field-orders-buyer-id',
            name: 'buyer_id',
            type: 'uuid',
            primaryKey: false,
            nullable: false,
            foreignKey: { entityId: 'entity-users', fieldId: 'field-users-id' },
          },
          { id: 'field-orders-ordered-at', name: 'ordered_at', type: 'timestamp', primaryKey: false, nullable: false, foreignKey: null },
        ],
      },
    ],
    relationships: [
      {
        id: 'relationship-users-listings',
        sourceEntityId: 'entity-users',
        targetEntityId: 'entity-listings',
        sourceFieldId: 'field-users-id',
        targetFieldId: 'field-listings-seller-id',
        cardinality: '1:N',
        label: 'seller owns listings',
      },
      {
        id: 'relationship-listings-orders',
        sourceEntityId: 'entity-listings',
        targetEntityId: 'entity-orders',
        sourceFieldId: 'field-listings-id',
        targetFieldId: 'field-orders-listing-id',
        cardinality: '1:N',
        label: 'listing produces orders',
      },
      {
        id: 'relationship-users-orders',
        sourceEntityId: 'entity-users',
        targetEntityId: 'entity-orders',
        sourceFieldId: 'field-users-id',
        targetFieldId: 'field-orders-buyer-id',
        cardinality: '1:N',
        label: 'buyer places orders',
      },
    ],
    view: {
      zoom: 1,
      x: 0,
      y: 0,
    },
  };
}
