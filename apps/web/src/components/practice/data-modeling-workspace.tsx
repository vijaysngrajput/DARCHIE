'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  NodeResizer,
  Position,
  ReactFlow,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  type NodeProps,
} from '@xyflow/react';
import {
  Boxes,
  Circle,
  ClipboardPaste,
  Cloud,
  Copy,
  Database,
  Diamond,
  HardDrive,
  Layers3,
  Link2,
  MessageSquareText,
  PenSquare,
  RefreshCcw,
  Send,
  ServerCog,
  ShieldCheck,
  Square,
  Trash2,
  Workflow,
} from 'lucide-react';
import { PromptPanel } from '@/components/practice/prompt-panel';
import { ResultPanel } from '@/components/practice/result-panel';
import { WorkspaceStatusBar } from '@/components/practice/workspace-status-bar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { cn } from '@/lib/utils';
import type {
  DataModelEntity,
  DataModelRelationship,
  DataModelRelationshipCardinality,
  DataModelingWorkspaceState,
  ExerciseWorkspaceProps,
  FeedbackState,
  ResultPanelModel,
} from '@/types/practice';

type Issue = {
  id: string;
  severity: 'error' | 'warning';
  issue: string;
  why: string;
  suggestedFix: string;
};

type ShapeKind =
  | 'entity'
  | 'annotation'
  | 'container'
  | 'rectangle'
  | 'circle'
  | 'diamond'
  | 's3'
  | 'warehouse'
  | 'stream'
  | 'compute'
  | 'cluster';

type ShapeCategory = 'erd' | 'basic' | 'infra';

type SupportingShape = {
  id: string;
  shapeKind: Exclude<ShapeKind, 'entity'>;
  label: string;
  category: ShapeCategory;
  position: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
};

type CanvasSelection =
  | { type: 'entity'; id: string }
  | { type: 'relationship'; id: string }
  | { type: 'shape'; id: string }
  | null;

type PaletteItem = {
  id: string;
  label: string;
  hint: string;
  shapeKind: ShapeKind;
  category: ShapeCategory;
  icon: React.ComponentType<{ className?: string }>;
  tone: 'gold' | 'blue' | 'slate';
};

type EntityNodeData = {
  id: string;
  label: string;
  entity?: DataModelEntity;
  shapeKind: ShapeKind;
  selected: boolean;
  invalid: boolean;
  warning: boolean;
  width?: number;
  height?: number;
  isEditing?: boolean;
  onLabelChange?: (id: string, value: string) => void;
  onFinishEditing?: () => void;
  onStartEditing?: (id: string) => void;
  onAddField?: (id: string) => void;
  onCopy?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
  editingField?: { fieldId: string; mode: 'name' | 'type' } | null;
  onStartFieldEditing?: (entityId: string, fieldId: string, mode: 'name' | 'type') => void;
  onFinishFieldEditing?: () => void;
  onFieldChange?: (entityId: string, fieldId: string, updates: Partial<DataModelEntity['fields'][number]>) => void;
};

type ClipboardEntry =
  | {
      type: 'entity';
      entity: DataModelEntity;
    }
  | {
      type: 'shape';
      shape: SupportingShape;
    }
  | null;

type ContextMenuState = {
  x: number;
  y: number;
  target: CanvasSelection;
} | null;

const CARDINALITY_OPTIONS: DataModelRelationshipCardinality[] = ['1:1', '1:N', 'N:1', 'N:N'];

const paletteGroups: Array<{
  title: string;
  description: string;
  items: PaletteItem[];
}> = [
  {
    title: 'Data model',
    description: 'Core schema objects and ERD framing tools.',
    items: [
      {
        id: 'palette-entity',
        label: 'Entity / table',
        hint: 'Validated schema object with fields, keys, and relationships.',
        shapeKind: 'entity',
        category: 'erd',
        icon: Database,
        tone: 'gold',
      },
      {
        id: 'palette-relationship',
        label: 'Relationship connector',
        hint: 'Use React Flow handles to connect entities, then set cardinality in the bottom inspector.',
        shapeKind: 'annotation',
        category: 'erd',
        icon: Link2,
        tone: 'slate',
      },
      {
        id: 'palette-note',
        label: 'Note',
        hint: 'Capture design assumptions or tradeoff reminders.',
        shapeKind: 'annotation',
        category: 'erd',
        icon: MessageSquareText,
        tone: 'blue',
      },
      {
        id: 'palette-group',
        label: 'Grouping boundary',
        hint: 'Frame a bounded context or lifecycle area around related objects.',
        shapeKind: 'container',
        category: 'erd',
        icon: Boxes,
        tone: 'gold',
      },
    ],
  },
  {
    title: 'Diagram basics',
    description: 'Clean foundational shapes for lightweight architecture support.',
    items: [
      { id: 'palette-rect', label: 'Rectangle', hint: 'Generic system or process block.', shapeKind: 'rectangle', category: 'basic', icon: Square, tone: 'slate' },
      { id: 'palette-circle', label: 'Circle', hint: 'Lightweight event or actor marker.', shapeKind: 'circle', category: 'basic', icon: Circle, tone: 'slate' },
      { id: 'palette-diamond', label: 'Diamond', hint: 'Decision or branching point.', shapeKind: 'diamond', category: 'basic', icon: Diamond, tone: 'slate' },
    ],
  },
  {
    title: 'Cloud / system',
    description: 'Small curated support set for surrounding platform context.',
    items: [
      { id: 'palette-s3', label: 'S3 / storage', hint: 'Object storage or landing bucket.', shapeKind: 's3', category: 'infra', icon: HardDrive, tone: 'blue' },
      { id: 'palette-warehouse', label: 'Warehouse', hint: 'Analytics store or serving layer.', shapeKind: 'warehouse', category: 'infra', icon: Database, tone: 'blue' },
      { id: 'palette-stream', label: 'Stream', hint: 'Queue or streaming transport.', shapeKind: 'stream', category: 'infra', icon: Workflow, tone: 'blue' },
      { id: 'palette-compute', label: 'Batch / compute', hint: 'ETL or transformation runtime.', shapeKind: 'compute', category: 'infra', icon: ServerCog, tone: 'blue' },
      { id: 'palette-cluster', label: 'Cluster / platform', hint: 'Higher-level compute boundary or service cluster.', shapeKind: 'cluster', category: 'infra', icon: Cloud, tone: 'blue' },
    ],
  },
];

const shapeKindMetadata: Record<ShapeKind, { icon: React.ComponentType<{ className?: string }>; tone: PaletteItem['tone'] }> = {
  entity: { icon: Database, tone: 'gold' },
  annotation: { icon: MessageSquareText, tone: 'blue' },
  container: { icon: Boxes, tone: 'gold' },
  rectangle: { icon: Square, tone: 'slate' },
  circle: { icon: Circle, tone: 'slate' },
  diamond: { icon: Diamond, tone: 'slate' },
  s3: { icon: HardDrive, tone: 'blue' },
  warehouse: { icon: Database, tone: 'blue' },
  stream: { icon: Workflow, tone: 'blue' },
  compute: { icon: ServerCog, tone: 'blue' },
  cluster: { icon: Cloud, tone: 'blue' },
};

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDraftEntity(index: number, position?: { x: number; y: number }): DataModelEntity {
  return {
    id: makeId('entity'),
    name: '',
    description: '',
    persistent: true,
    position: position ?? {
      x: 120 + ((index % 3) * 250),
      y: 120 + (Math.floor(index / 3) * 190),
    },
    fields: [
      {
        id: makeId('field'),
        name: '',
        type: 'uuid',
        primaryKey: true,
        nullable: false,
        foreignKey: null,
      },
    ],
  };
}

function createSupportingShape(item: PaletteItem, index: number, position?: { x: number; y: number }): SupportingShape {
  const dimensions = (() => {
    switch (item.shapeKind) {
      case 'container':
        return { width: 220, height: 130 };
      case 'circle':
        return { width: 128, height: 128 };
      case 'diamond':
        return { width: 140, height: 140 };
      case 'annotation':
        return { width: 188, height: 104 };
      default:
        return { width: 172, height: 104 };
    }
  })();

  return {
    id: makeId(item.shapeKind),
    shapeKind: item.shapeKind as Exclude<ShapeKind, 'entity'>,
    label: item.label,
    category: item.category,
    position: position ?? {
      x: 160 + ((index % 3) * 230),
      y: 160 + (Math.floor(index / 3) * 170),
    },
    width: dimensions.width,
    height: dimensions.height,
  };
}

function getToneClasses(tone: PaletteItem['tone']) {
  if (tone === 'gold') {
    return 'border-[color-mix(in_oklab,var(--accent-secondary)_38%,var(--border-soft))] bg-[color-mix(in_oklab,var(--accent-secondary)_12%,var(--bg-panel))] text-[var(--accent-secondary)]';
  }
  if (tone === 'blue') {
    return 'border-[color-mix(in_oklab,var(--accent-primary)_32%,var(--border-soft))] bg-[color-mix(in_oklab,var(--accent-primary)_12%,var(--bg-panel))] text-[var(--accent-primary)]';
  }
  return 'border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_78%,var(--bg-elevated))] text-[var(--text-secondary)]';
}

function buildIdleResult(summary: string): ResultPanelModel {
  return {
    status: 'idle',
    summary,
    tabs: [
      { id: 'validation', label: 'Validation', body: 'Validate the ERD objects to inspect keys, names, and cardinality coverage.' },
      { id: 'review', label: 'Review', body: 'Review notes will focus on modeling clarity and architecture tradeoffs.' },
      { id: 'explanation', label: 'Explanation', body: 'Use supporting system shapes for context, but keep the data model itself defensible.' },
    ],
    explanation: 'This workspace should feel like a serious architecture surface where you can show schema structure and the surrounding system context together.',
  };
}

function buildReviewResult(kind: 'validate' | 'submit', issues: Issue[], entities: DataModelEntity[], relationships: DataModelRelationship[], supportShapes: SupportingShape[]): ResultPanelModel {
  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const status: FeedbackState = errors.length ? 'validationError' : 'success';

  const reviewBody = [
    warnings.length
      ? warnings.map((issue) => `Issue: ${issue.issue}\nWhy it matters: ${issue.why}\nSuggested fix: ${issue.suggestedFix}`).join('\n\n')
      : 'No major design warnings were surfaced in this pass.',
    `\n\nStrengths:\n- ERD entities on canvas: ${entities.length}\n- Relationships modeled: ${relationships.length}\n- Supporting context shapes: ${supportShapes.length}`,
  ].join('');

  const validationBody = errors.length
    ? errors.map((issue) => `Issue: ${issue.issue}\nWhy it matters: ${issue.why}\nSuggested fix: ${issue.suggestedFix}`).join('\n\n')
    : 'No blocking ERD validation errors were found. Supporting architecture shapes remain advisory and do not block submission in v1.';

  const explanation = errors.length
    ? 'Fix the structural ERD issues first. Supporting shapes can make the diagram richer, but they do not replace clear keys, unique entities, and valid relationship direction.'
    : kind === 'submit'
      ? 'The mocked design review treats this as a hybrid architecture canvas: the ERD must be structurally sound, and the surrounding support shapes should clarify how the data model fits into the system.'
      : 'The ERD structure is sound enough to discuss tradeoffs. Next, use notes, containers, or system shapes only where they sharpen the story instead of cluttering the design.';

  return {
    status,
    summary: errors.length
      ? `${errors.length} blocking issue${errors.length === 1 ? '' : 's'} need attention before submission.`
      : kind === 'submit'
        ? 'Submission review is ready for the current hybrid design canvas.'
        : 'Validation passed for the current ERD structure.',
    tabs: [
      { id: 'validation', label: 'Validation', body: validationBody, status: errors.length ? 'warning' : 'success' },
      { id: 'review', label: 'Review', body: reviewBody, status: warnings.length ? 'warning' : 'neutral' },
      { id: 'explanation', label: 'Explanation', body: explanation, status: 'neutral' },
    ],
    explanation,
  };
}

function validateWorkspace(exerciseId: string, entities: DataModelEntity[], relationships: DataModelRelationship[]): Issue[] {
  const issues: Issue[] = [];
  const normalizedNameMap = new Map<string, string[]>();
  const entityById = new Map(entities.map((entity) => [entity.id, entity]));

  for (const entity of entities) {
    const normalized = entity.name.trim().toLowerCase();
    if (!normalized) {
      issues.push({
        id: `${entity.id}-missing-name`,
        severity: 'error',
        issue: 'An entity is missing a name.',
        why: 'Unnamed entities make ownership and relationship reasoning impossible to review.',
        suggestedFix: 'Give each entity a stable table-style name before validating again.',
      });
    } else {
      normalizedNameMap.set(normalized, [...(normalizedNameMap.get(normalized) ?? []), entity.id]);
    }

    if (entity.fields.length === 0) {
      issues.push({
        id: `${entity.id}-no-fields`,
        severity: 'error',
        issue: `${entity.name || 'Unnamed entity'} has no fields.`,
        why: 'Interviewers need to see key structure, not only box labels.',
        suggestedFix: 'Add at least one field and mark the primary identifier.',
      });
    }

    if (entity.persistent && !entity.fields.some((field) => field.primaryKey)) {
      issues.push({
        id: `${entity.id}-missing-pk`,
        severity: 'error',
        issue: `${entity.name || 'Unnamed entity'} has no primary key.`,
        why: 'Persistent entities need a durable identity to support joins, history, and constraint reasoning.',
        suggestedFix: 'Mark one field as the primary key or add an id field.',
      });
    }
  }

  for (const [normalizedName, ids] of normalizedNameMap.entries()) {
    if (ids.length > 1) {
      issues.push({
        id: `duplicate-${normalizedName}`,
        severity: 'error',
        issue: `Entity name "${normalizedName}" is used multiple times.`,
        why: 'Duplicate entity names blur grain and ownership boundaries.',
        suggestedFix: 'Rename the duplicate entities so each one has a single architectural meaning.',
      });
    }
  }

  for (const relationship of relationships) {
    const source = entityById.get(relationship.sourceEntityId);
    const target = entityById.get(relationship.targetEntityId);

    if (!source || !target) {
      issues.push({
        id: `${relationship.id}-broken-endpoints`,
        severity: 'error',
        issue: 'A relationship points to a missing entity.',
        why: 'Detached relationships make the model impossible to validate.',
        suggestedFix: 'Reconnect the relationship or remove it.',
      });
      continue;
    }

    if (!relationship.cardinality) {
      issues.push({
        id: `${relationship.id}-missing-cardinality`,
        severity: 'error',
        issue: `Relationship between ${source.name || 'source'} and ${target.name || 'target'} has no cardinality.`,
        why: 'Without cardinality, reviewers cannot judge ownership, duplication risk, or aggregation correctness.',
        suggestedFix: 'Choose a relationship cardinality such as 1:N or N:N.',
      });
    }
  }

  if (exerciseId === 'marketplace-core-entities') {
    const names = entities.map((entity) => entity.name.trim().toLowerCase()).filter(Boolean);
    if (!names.some((name) => name.includes('payment') || name.includes('transaction'))) {
      issues.push({
        id: 'marketplace-payments-warning',
        severity: 'warning',
        issue: 'No payment or transaction entity is modeled yet.',
        why: 'Marketplace systems usually need a separate financial lifecycle beyond listings and orders.',
        suggestedFix: 'Decide whether payment settlement belongs as its own entity in this first-pass model.',
      });
    }
  }

  return issues;
}

function makeEntityNode(entity: DataModelEntity, issues: Issue[], selected: boolean): Node<EntityNodeData> {
  const relatedIssues = issues.filter((issue) => issue.id.startsWith(entity.id));
  const estimatedHeight = Math.max(210, 122 + (entity.fields.length * 58));
  return {
    id: entity.id,
    type: 'canvas-node',
    position: entity.position,
    initialWidth: 240,
    initialHeight: estimatedHeight,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    handles: [
      {
        id: `${entity.id}-target`,
        type: 'target',
        position: Position.Left,
        x: 0,
        y: estimatedHeight / 2,
        width: 12,
        height: 12,
      },
      {
        id: `${entity.id}-source`,
        type: 'source',
        position: Position.Right,
        x: 240,
        y: estimatedHeight / 2,
        width: 12,
        height: 12,
      },
    ],
    data: {
      id: entity.id,
      label: entity.name || 'Untitled entity',
      entity,
      shapeKind: 'entity',
      selected,
      invalid: relatedIssues.some((issue) => issue.severity === 'error'),
      warning: relatedIssues.some((issue) => issue.severity === 'warning'),
    },
  };
}

function makeShapeNode(shape: SupportingShape, selected: boolean): Node<EntityNodeData> {
  return {
    id: shape.id,
    type: 'canvas-node',
    position: shape.position,
    initialWidth: shape.width,
    initialHeight: shape.height,
    data: {
      id: shape.id,
      label: shape.label,
      shapeKind: shape.shapeKind,
      selected,
      invalid: false,
      warning: false,
      width: shape.width,
      height: shape.height,
    },
  };
}

function makeRelationshipEdge(relationship: DataModelRelationship, selected: boolean, issues: Issue[]): Edge {
  const issue = issues.find((candidate) => candidate.id.startsWith(relationship.id));
  const stroke = issue?.severity === 'error'
    ? 'var(--accent-error)'
    : issue?.severity === 'warning'
      ? 'var(--accent-warning)'
      : 'var(--accent-primary)';

  return {
    id: relationship.id,
    source: relationship.sourceEntityId,
    target: relationship.targetEntityId,
    animated: selected,
    label: relationship.cardinality ? `${relationship.cardinality}${relationship.label ? ` · ${relationship.label}` : ''}` : 'Choose cardinality',
    markerEnd: {
      type: MarkerType.ArrowClosed,
      color: stroke,
    },
    style: {
      stroke,
      strokeWidth: selected ? 2.6 : 1.8,
    },
    labelStyle: {
      fill: 'var(--text-primary)',
      fontSize: 12,
      fontWeight: 600,
    },
    labelBgStyle: {
      fill: 'var(--bg-panel)',
      fillOpacity: 0.95,
      stroke: 'var(--border-soft)',
    },
  };
}

function CanvasNode({ data }: NodeProps<Node<EntityNodeData>>) {
  if (data.shapeKind === 'entity' && data.entity) {
    return (
      <div
        className={cn(
          'min-w-[240px] rounded-[18px] border bg-[var(--bg-panel)] p-4 shadow-[var(--shadow-panel)] transition-colors duration-[130ms] ease-[var(--ease-standard)]',
          data.selected
            ? 'border-[color-mix(in_oklab,var(--accent-primary)_60%,var(--border-strong))] ring-2 ring-[var(--focus-ring)]'
            : data.invalid
              ? 'border-[color-mix(in_oklab,var(--accent-error)_60%,var(--border-strong))]'
              : data.warning
                ? 'border-[color-mix(in_oklab,var(--accent-warning)_48%,var(--border-strong))]'
                : 'border-[var(--border-soft)]',
        )}
      >
        <Handle type="target" position={Position.Left} className="!h-3 !w-3 !border-2 !border-[var(--bg-panel)] !bg-[var(--accent-primary)]" />
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-soft)] pb-3">
          <div>
            {data.isEditing ? (
              <input
                autoFocus
                value={data.entity.name}
                onChange={(event) => data.onLabelChange?.(data.id, event.target.value)}
                onBlur={() => data.onFinishEditing?.()}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === 'Escape') {
                    event.preventDefault();
                    data.onFinishEditing?.();
                  }
                }}
                className="h-9 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-3 text-base font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)]"
              />
            ) : (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  data.onStartEditing?.(data.id);
                }}
                className="text-left font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.02em] text-[var(--text-primary)] transition-colors hover:text-[var(--accent-primary)]"
              >
                {data.label}
              </button>
            )}
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {data.entity.persistent ? 'Persistent entity' : 'Supporting entity'}
            </p>
          </div>
          {data.invalid ? <Badge variant="warning">Needs fixes</Badge> : data.warning ? <Badge variant="info">Review</Badge> : <Badge variant="neutral">Ready</Badge>}
        </div>
        <div className="mt-3 space-y-2">
          {data.entity.fields.map((field) => (
            <div key={field.id} className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] px-3 py-2 text-sm">
              <div className="min-w-0">
                {data.editingField?.fieldId === field.id && data.editingField.mode === 'name' ? (
                  <input
                    autoFocus
                    value={field.name}
                    onChange={(event) => data.onFieldChange?.(data.id, field.id, { name: event.target.value })}
                    onBlur={() => data.onFinishFieldEditing?.()}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === 'Escape') {
                        event.preventDefault();
                        data.onFinishFieldEditing?.();
                      }
                    }}
                    className="h-8 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-2.5 text-sm font-medium text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)]"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      data.onStartFieldEditing?.(data.id, field.id, 'name');
                    }}
                    className="truncate font-medium text-[var(--text-primary)] transition-colors hover:text-[var(--accent-primary)]"
                  >
                    {field.name || 'unnamed_field'}
                  </button>
                )}
                {data.editingField?.fieldId === field.id && data.editingField.mode === 'type' ? (
                  <select
                    autoFocus
                    value={field.type}
                    onChange={(event) =>
                      data.onFieldChange?.(data.id, field.id, {
                        type: event.target.value as DataModelEntity['fields'][number]['type'],
                      })
                    }
                    onBlur={() => data.onFinishFieldEditing?.()}
                    className="mt-1 h-7 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-2 text-[11px] uppercase tracking-[0.12em] text-[var(--text-muted)] outline-none focus:border-[var(--border-strong)]"
                  >
                    <option value="uuid">uuid</option>
                    <option value="integer">integer</option>
                    <option value="string">string</option>
                    <option value="timestamp">timestamp</option>
                    <option value="decimal">decimal</option>
                    <option value="boolean">boolean</option>
                  </select>
                ) : (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      data.onStartFieldEditing?.(data.id, field.id, 'type');
                    }}
                    className="text-xs uppercase tracking-[0.12em] text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]"
                  >
                    {field.type}
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    data.onFieldChange?.(data.id, field.id, {
                      primaryKey: !field.primaryKey,
                      nullable: !field.primaryKey ? false : field.nullable,
                    });
                  }}
                  className={cn(
                    'rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] transition-colors',
                    field.primaryKey
                      ? 'border-[color-mix(in_oklab,var(--accent-secondary)_34%,var(--border-soft))] bg-[color-mix(in_oklab,var(--accent-secondary)_10%,transparent)] text-[var(--accent-secondary)]'
                      : 'border-[var(--border-soft)] bg-transparent text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]',
                  )}
                >
                  PK
                </button>
                {field.foreignKey ? <Badge variant="neutral">FK</Badge> : null}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            data.onAddField?.(data.id);
          }}
          className="mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-dashed border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-elevated)_72%,transparent)] text-sm font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
        >
          <span className="text-base leading-none">+</span>
          <span>Add field</span>
        </button>
        <Handle type="source" position={Position.Right} className="!h-3 !w-3 !border-2 !border-[var(--bg-panel)] !bg-[var(--accent-secondary)]" />
      </div>
    );
  }

  const ShapeIcon = shapeKindMetadata[data.shapeKind].icon;
  const toneClasses = getToneClasses(shapeKindMetadata[data.shapeKind].tone);

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-[20px] border px-5 py-4 text-center shadow-[var(--shadow-soft)] transition-colors duration-[130ms] ease-[var(--ease-standard)]',
        data.selected
          ? 'border-[color-mix(in_oklab,var(--accent-primary)_60%,var(--border-strong))] bg-[var(--bg-panel)] ring-2 ring-[var(--focus-ring)]'
          : 'border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_86%,var(--bg-elevated))]',
        data.shapeKind === 'annotation' && 'border-dashed',
        data.shapeKind === 'container' && 'bg-[color-mix(in_oklab,var(--accent-secondary)_8%,var(--bg-panel))]',
        data.shapeKind === 'circle' && 'rounded-full',
        data.shapeKind === 'diamond' && 'rotate-45 rounded-[12px]',
        (data.shapeKind === 's3' || data.shapeKind === 'warehouse' || data.shapeKind === 'stream' || data.shapeKind === 'compute' || data.shapeKind === 'cluster') &&
          'border-[color-mix(in_oklab,var(--accent-primary)_26%,var(--border-soft))] bg-[color-mix(in_oklab,var(--accent-primary)_10%,var(--bg-panel))]',
      )}
      style={{
        width: data.width ?? 172,
        height: data.height ?? 104,
      }}
    >
      <NodeResizer
        isVisible={data.selected}
        minWidth={96}
        minHeight={72}
        lineStyle={{ borderColor: 'var(--accent-primary)' }}
        handleStyle={{ width: 10, height: 10, borderRadius: 9999, border: '1px solid var(--bg-panel)', background: 'var(--accent-primary)' }}
      />
      <div className={cn('flex flex-col items-center gap-2', data.shapeKind === 'diamond' && '-rotate-45')}>
        <div className={cn('flex size-10 items-center justify-center rounded-full border', toneClasses)}>
          <ShapeIcon className="size-4" />
        </div>
        <div>
          {data.isEditing ? (
            <input
              autoFocus
              value={data.label}
              onChange={(event) => data.onLabelChange?.(data.id, event.target.value)}
              onBlur={() => data.onFinishEditing?.()}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === 'Escape') {
                  event.preventDefault();
                  data.onFinishEditing?.();
                }
              }}
              className="h-8 w-[120px] rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-3 text-center text-sm font-semibold text-[var(--text-primary)] outline-none focus:border-[var(--border-strong)]"
            />
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                data.onStartEditing?.(data.id);
              }}
              className="text-sm font-semibold text-[var(--text-primary)] transition-colors hover:text-[var(--accent-primary)]"
            >
              {data.label}
            </button>
          )}
          <div className="mt-1 text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {data.shapeKind === 'container' ? 'Context' : data.shapeKind === 'annotation' ? 'Note' : 'Support shape'}
          </div>
        </div>
      </div>
    </div>
  );
}

function DataModelingCanvas({
  nodes,
  edges,
  selection,
  entities,
  relationships,
  onNodesChange,
  onEdgesChange,
  onNodeClick,
  onEdgeClick,
  onConnect,
  onDropPaletteItem,
  recentlyAddedLabel,
  recentlyAddedNodeId,
  onNodeDoubleClick,
  onNodeContextMenu,
  onPaneClick,
  editingTarget,
  editingFieldTarget,
  onStartFieldEditing,
  onFinishFieldEditing,
  onUpdateField,
  onLabelChange,
  onFinishEditing,
  contextMenu,
  canPaste,
  onCopySelection,
  onPaste,
  onDuplicateSelection,
  onDeleteSelection,
  onAddField,
  onSetRelationshipCardinality,
}: {
  nodes: Array<Node<EntityNodeData>>;
  edges: Edge[];
  selection: CanvasSelection;
  entities: DataModelEntity[];
  relationships: DataModelRelationship[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onNodeClick: (nodeId: string) => void;
  onEdgeClick: (edgeId: string) => void;
  onConnect: (connection: Connection) => void;
  onDropPaletteItem: (shapeKind: ShapeKind, position: { x: number; y: number }) => void;
  recentlyAddedLabel: string | null;
  recentlyAddedNodeId: string | null;
  onNodeDoubleClick: (nodeId: string) => void;
  onNodeContextMenu: (nodeId: string, x: number, y: number) => void;
  onPaneClick: () => void;
  editingTarget: CanvasSelection;
  editingFieldTarget: { entityId: string; fieldId: string; mode: 'name' | 'type' } | null;
  onStartFieldEditing: (entityId: string, fieldId: string, mode: 'name' | 'type') => void;
  onFinishFieldEditing: () => void;
  onUpdateField: (entityId: string, fieldId: string, updates: Partial<DataModelEntity['fields'][number]>) => void;
  onLabelChange: (id: string, value: string) => void;
  onFinishEditing: () => void;
  contextMenu: ContextMenuState;
  canPaste: boolean;
  onCopySelection: () => void;
  onPaste: () => void;
  onDuplicateSelection: () => void;
  onDeleteSelection: () => void;
  onAddField: (entityId: string) => void;
  onSetRelationshipCardinality: (relationshipId: string, cardinality: DataModelRelationshipCardinality) => void;
}) {
  const [isClientReady, setIsClientReady] = useState(false);
  const { screenToFlowPosition, setCenter } = useReactFlow<Node<EntityNodeData>, Edge>();

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  useEffect(() => {
    if (!recentlyAddedNodeId) return;
    const addedNode = nodes.find((node) => node.id === recentlyAddedNodeId);
    if (!addedNode) return;

    const widthOffset = addedNode.data.shapeKind === 'entity' ? 140 : 90;
    const heightOffset = addedNode.data.shapeKind === 'circle' ? 60 : addedNode.data.shapeKind === 'container' ? 72 : 48;

    window.requestAnimationFrame(() => {
      setCenter(addedNode.position.x + widthOffset, addedNode.position.y + heightOffset, {
        zoom: 1,
        duration: 320,
      });
    });
  }, [nodes, recentlyAddedNodeId, setCenter]);

  return (
    <div
      className="relative h-[780px] overflow-hidden rounded-[28px] border border-[var(--border-strong)] bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_12%,transparent),transparent_28%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_88%,transparent),color-mix(in_oklab,var(--bg-surface)_74%,transparent))] shadow-[var(--shadow-panel)]"
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
      }}
      onDrop={(event) => {
        event.preventDefault();
        const shapeKind = (
          event.dataTransfer.getData('application/x-darchie-shape') ||
          event.dataTransfer.getData('text/plain')
        ) as ShapeKind;
        if (!shapeKind) return;
        const flowPosition = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });
        onDropPaletteItem(shapeKind, {
          x: flowPosition.x - 110,
          y: flowPosition.y - 60,
        });
      }}
    >
      {isClientReady ? (
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isEditing:
                !!editingTarget &&
                (editingTarget.type === 'entity' || editingTarget.type === 'shape') &&
                editingTarget.id === node.id,
              onLabelChange,
              onFinishEditing,
              onStartEditing: (id: string) => onNodeDoubleClick(id),
              onAddField: node.data.shapeKind === 'entity' ? (id: string) => onAddField(id) : undefined,
              onCopy: () => onCopySelection(),
              onDuplicate: () => onDuplicateSelection(),
              onDelete: () => onDeleteSelection(),
              editingField:
                node.data.shapeKind === 'entity' &&
                editingFieldTarget &&
                editingFieldTarget.entityId === node.id
                  ? { fieldId: editingFieldTarget.fieldId, mode: editingFieldTarget.mode }
                  : null,
              onStartFieldEditing:
                node.data.shapeKind === 'entity'
                  ? (entityId: string, fieldId: string, mode: 'name' | 'type') =>
                      onStartFieldEditing(entityId, fieldId, mode)
                  : undefined,
              onFinishFieldEditing,
              onFieldChange:
                node.data.shapeKind === 'entity'
                  ? (entityId: string, fieldId: string, updates: Partial<DataModelEntity['fields'][number]>) =>
                      onUpdateField(entityId, fieldId, updates)
                  : undefined,
            },
          }))}
          edges={edges}
          nodeTypes={{ 'canvas-node': CanvasNode }}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => onNodeClick(node.id)}
          onNodeDoubleClick={(_, node) => onNodeDoubleClick(node.id)}
          onNodeContextMenu={(event, node) => {
            event.preventDefault();
            onNodeContextMenu(node.id, event.clientX, event.clientY);
          }}
          onEdgeClick={(_, edge) => onEdgeClick(edge.id)}
          onPaneClick={onPaneClick}
          onConnect={onConnect}
          fitView
          minZoom={0.3}
          maxZoom={1.9}
          defaultEdgeOptions={{ type: 'smoothstep' }}
          attributionPosition="bottom-left"
          className="bg-transparent"
        >
          <Background gap={24} size={1} color="color-mix(in oklab, var(--accent-primary) 22%, transparent)" />
          <Controls showInteractive={false} position="bottom-right" />
        </ReactFlow>
      ) : (
        <div className="h-full w-full animate-pulse bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_10%,transparent),transparent_30%)]" />
      )}
      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between gap-4">
        <div className="rounded-full border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_90%,transparent)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)] backdrop-blur">
          Architecture canvas
        </div>
        <div className="rounded-full border border-[color-mix(in_oklab,var(--accent-secondary)_36%,transparent)] bg-[color-mix(in_oklab,var(--accent-secondary)_12%,transparent)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)] backdrop-blur">
          Click or drag tools into the board
        </div>
      </div>
      {recentlyAddedLabel ? (
        <div className="pointer-events-none absolute left-5 top-20 rounded-full border border-[color-mix(in_oklab,var(--accent-primary)_34%,transparent)] bg-[color-mix(in_oklab,var(--accent-primary)_12%,transparent)] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-primary)] backdrop-blur">
          Added {recentlyAddedLabel}
        </div>
      ) : null}
      {contextMenu ? (
        <div
          className="absolute z-20 min-w-[180px] rounded-[18px] border border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--bg-panel)_94%,transparent)] p-2 shadow-[var(--shadow-panel)] backdrop-blur"
          style={{ left: contextMenu.x, top: contextMenu.y }}
        >
          <button
            type="button"
            onClick={onCopySelection}
            className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
          >
            <Copy className="size-4" />
            Copy
          </button>
          <button
            type="button"
            onClick={onPaste}
            disabled={!canPaste}
            className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] disabled:opacity-45"
          >
            <ClipboardPaste className="size-4" />
            Paste
          </button>
          <button
            type="button"
            onClick={onDeleteSelection}
            className="flex w-full items-center gap-2 rounded-[12px] px-3 py-2 text-sm text-[var(--accent-error)] hover:bg-[color-mix(in_oklab,var(--accent-error)_8%,transparent)]"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </div>
      ) : null}
      {selection?.type === 'relationship' ? (
        <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 w-[min(92%,560px)] -translate-x-1/2">
          <div className="pointer-events-auto rounded-[18px] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_92%,transparent)] px-4 py-3 shadow-[var(--shadow-panel)] backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Relationship tools</p>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {(entities.find((entity) => entity.id === relationships.find((relationship) => relationship.id === selection.id)?.sourceEntityId)?.name || 'source')}
                  {' to '}
                  {(entities.find((entity) => entity.id === relationships.find((relationship) => relationship.id === selection.id)?.targetEntityId)?.name || 'target')}
                </p>
              </div>
              <button
                type="button"
                onClick={onDeleteSelection}
                className="h-9 rounded-[var(--radius-md)] px-3 text-sm font-medium text-[var(--accent-error)] transition-colors hover:bg-[color-mix(in_oklab,var(--accent-error)_8%,transparent)]"
              >
                Delete
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {CARDINALITY_OPTIONS.map((option) => {
                const active = relationships.find((relationship) => relationship.id === selection.id)?.cardinality === option;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onSetRelationshipCardinality(selection.id, option)}
                    className={cn(
                      'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
                      active
                        ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                        : 'border-[var(--border-soft)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
      {!nodes.length ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-8">
          <div className="max-w-[420px] rounded-[24px] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_90%,transparent)] px-6 py-6 text-center shadow-[var(--shadow-soft)] backdrop-blur">
            <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              Start with the data model, then layer system context
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
              Use entities and relationships for the real ERD. Add notes, containers, or curated cloud shapes only when they sharpen the story you are architecting.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BottomInspector({
  selection,
  entities,
  relationships,
  supportShapes,
  onSetRelationshipCardinality,
  onDeleteSelection,
  onUpdateEntity,
  onAddField,
  onUpdateField,
  onDeleteField,
  onUpdateShapeLabel,
  onUpdateShapeSize,
}: {
  selection: CanvasSelection;
  entities: DataModelEntity[];
  relationships: DataModelRelationship[];
  supportShapes: SupportingShape[];
  onSetRelationshipCardinality: (relationshipId: string, cardinality: DataModelRelationshipCardinality) => void;
  onDeleteSelection: () => void;
  onUpdateEntity: (entityId: string, updates: Partial<Pick<DataModelEntity, 'name' | 'description' | 'persistent'>>) => void;
  onAddField: (entityId: string) => void;
  onUpdateField: (entityId: string, fieldId: string, updates: Partial<DataModelEntity['fields'][number]>) => void;
  onDeleteField: (entityId: string, fieldId: string) => void;
  onUpdateShapeLabel: (shapeId: string, label: string) => void;
  onUpdateShapeSize: (shapeId: string, size: { width: number; height: number }) => void;
}) {
  if (!selection) {
    return (
      <Panel variant="default" className="max-h-[calc(100vh-3rem)] overflow-hidden p-4 sm:p-5">
        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto overscroll-contain pr-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              Selection inspector
            </h2>
            <Badge variant="neutral">idle</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            Select an entity, relationship, or support shape on the canvas to inspect it here. The right rail is now reserved for compact palette tools, not long-form editing.
          </p>
        </div>
      </Panel>
    );
  }

  if (selection.type === 'relationship') {
    const relationship = relationships.find((item) => item.id === selection.id);
    if (!relationship) return null;
    const source = entities.find((item) => item.id === relationship.sourceEntityId);
    const target = entities.find((item) => item.id === relationship.targetEntityId);

    return (
      <Panel variant="default" className="max-h-[calc(100vh-3rem)] overflow-hidden p-4 sm:p-5">
        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto overscroll-contain pr-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              Relationship inspector
            </h2>
            <Badge variant="info">selected</Badge>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            {(source?.name || 'source')} to {(target?.name || 'target')}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {CARDINALITY_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => onSetRelationshipCardinality(relationship.id, option)}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
                  relationship.cardinality === option
                    ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                    : 'border-[var(--border-soft)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-panel)] hover:text-[var(--text-primary)]',
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <Button type="button" variant="ghost" className="mt-5 text-[var(--accent-error)]" onClick={onDeleteSelection}>
            Remove relationship
          </Button>
        </div>
      </Panel>
    );
  }

  if (selection.type === 'entity') {
    const entity = entities.find((item) => item.id === selection.id);
    if (!entity) return null;
    return (
      <Panel variant="default" className="max-h-[calc(100vh-3rem)] overflow-hidden p-4 sm:p-5">
        <div className="max-h-[calc(100vh-11rem)] overflow-y-auto overscroll-contain pr-1">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
              Entity overview
            </h2>
            <Badge variant="info">selected</Badge>
          </div>
          <div className="mt-4 space-y-2.5">
            <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Entity</p>
              <p className="mt-2 font-[family-name:var(--font-heading)] text-base font-semibold text-[var(--text-primary)]">
                {entity.name || 'Untitled entity'}
              </p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {entity.persistent ? 'Persistent entity' : 'Support entity'}
              </p>
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-3">
              <label
                className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]"
                htmlFor={`entity-name-${entity.id}`}
              >
                Entity name
              </label>
              <input
                id={`entity-name-${entity.id}`}
                value={entity.name}
                onChange={(event) => onUpdateEntity(entity.id, { name: event.target.value })}
                placeholder="users, orders, payments"
                className="mt-2 h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-strong)]"
              />
            </div>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-3">
              <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]" htmlFor={`entity-description-${entity.id}`}>
                Description
              </label>
              <textarea
                id={`entity-description-${entity.id}`}
                value={entity.description}
                onChange={(event) => onUpdateEntity(entity.id, { description: event.target.value })}
                rows={2}
                placeholder="What role does this entity play in the model?"
                className="mt-2 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 py-2.5 text-sm leading-6 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-strong)]"
              />
            </div>
            <label className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-3 text-sm text-[var(--text-secondary)]">
              <input
                type="checkbox"
                checked={entity.persistent}
                onChange={(event) => onUpdateEntity(entity.id, { persistent: event.target.checked })}
                className="mt-1 size-4 rounded border-[var(--border-soft)] accent-[var(--accent-primary)]"
              />
              <span>This is a persistent ERD entity that needs a durable primary key.</span>
            </label>
            <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Fields</p>
                  <p className="mt-1 text-sm leading-5 text-[var(--text-secondary)]">Keep fields compact and defensible.</p>
                </div>
                <Button type="button" variant="secondary" size="sm" onClick={() => onAddField(entity.id)} className="shrink-0">
                  <PenSquare className="size-4" />
                  Add field
                </Button>
              </div>
              <div className="mt-3 max-h-72 space-y-2 overflow-y-auto overscroll-contain pr-1">
                {entity.fields.map((field) => (
                  <div key={field.id} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-2">
                    <div className="space-y-2">
                      <input
                        value={field.name}
                        onChange={(event) => onUpdateField(entity.id, field.id, { name: event.target.value })}
                        placeholder="field_name"
                        className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-strong)]"
                      />
                      <select
                        value={field.type}
                        onChange={(event) => onUpdateField(entity.id, field.id, { type: event.target.value as DataModelEntity['fields'][number]['type'] })}
                        className="h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-strong)]"
                      >
                        <option value="uuid">uuid</option>
                        <option value="integer">integer</option>
                        <option value="string">string</option>
                        <option value="timestamp">timestamp</option>
                        <option value="decimal">decimal</option>
                        <option value="boolean">boolean</option>
                      </select>
                      <div className="flex items-center justify-between gap-3">
                        <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <input
                            type="checkbox"
                            checked={field.primaryKey}
                            onChange={(event) => onUpdateField(entity.id, field.id, { primaryKey: event.target.checked, nullable: event.target.checked ? false : field.nullable })}
                            className="size-4 rounded border-[var(--border-soft)] accent-[var(--accent-secondary)]"
                          />
                          PK
                        </label>
                        <button
                          type="button"
                          onClick={() => onDeleteField(entity.id, field.id)}
                          className="h-9 rounded-[var(--radius-md)] border border-[var(--border-soft)] px-3 text-sm font-medium text-[var(--accent-error)] transition-colors hover:border-[color-mix(in_oklab,var(--accent-error)_28%,var(--border-soft))] hover:bg-[color-mix(in_oklab,var(--accent-error)_8%,transparent)]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Button type="button" variant="ghost" className="mt-5 text-[var(--accent-error)]" onClick={onDeleteSelection}>
            Remove entity
          </Button>
        </div>
      </Panel>
    );
  }

  const shape = supportShapes.find((item) => item.id === selection.id);
  if (!shape) return null;

  return (
      <Panel variant="default" className="max-h-[calc(100vh-3rem)] overflow-hidden p-4 sm:p-5">
      <div className="max-h-[calc(100vh-11rem)] overflow-y-auto overscroll-contain pr-1">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
            Shape editor
          </h2>
          <Badge variant="neutral">{shape.category}</Badge>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          {shape.label} is contextual only in v1. Rename it, resize it, and use it to clarify the surrounding architecture without changing ERD validation rules.
        </p>
        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-4">
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]" htmlFor={`shape-label-${shape.id}`}>
              Shape label
            </label>
            <input
              id={`shape-label-${shape.id}`}
              value={shape.label}
              onChange={(event) => onUpdateShapeLabel(shape.id, event.target.value)}
              className="mt-2 h-11 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-strong)]"
            />
          </div>
          <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Canvas size</p>
            <div className="mt-3 space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Width</span>
                  <span>{Math.round(shape.width)} px</span>
                </div>
                <input
                  type="range"
                  min={96}
                  max={320}
                  step={4}
                  value={shape.width}
                  onChange={(event) => onUpdateShapeSize(shape.id, { width: Number(event.target.value), height: shape.height })}
                  className="mt-2 w-full accent-[var(--accent-primary)]"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>Height</span>
                  <span>{Math.round(shape.height)} px</span>
                </div>
                <input
                  type="range"
                  min={72}
                  max={280}
                  step={4}
                  value={shape.height}
                  onChange={(event) => onUpdateShapeSize(shape.id, { width: shape.width, height: Number(event.target.value) })}
                  className="mt-2 w-full accent-[var(--accent-primary)]"
                />
              </div>
            </div>
          </div>
        </div>
        <Button type="button" variant="ghost" className="mt-5 text-[var(--accent-error)]" onClick={onDeleteSelection}>
          Remove support shape
        </Button>
      </div>
    </Panel>
  );
}

function BuilderPalette({
  onAddShape,
}: {
  onAddShape: (shapeKind: ShapeKind) => void;
}) {
  const [hoveredItem, setHoveredItem] = useState<PaletteItem>(paletteGroups[0].items[0]);

  return (
    <div className="self-stretch">
      <Panel variant="default" className="flex h-full min-h-full flex-col p-4 sm:p-5">
        <div className="flex items-center gap-2">
          <Boxes className="size-4 text-[var(--accent-secondary)]" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Builder palette</p>
        </div>
        <p className="mt-2 text-xs leading-5 text-[var(--text-secondary)]">
          Hover to inspect. Click to place. Drag onto canvas.
        </p>
        <div className="mt-3 rounded-[18px] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-3">
          <div className="flex items-center gap-3">
            <div className={cn('flex size-11 items-center justify-center rounded-[14px] border', getToneClasses(hoveredItem.tone))}>
              <hoveredItem.icon className="size-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">{hoveredItem.label}</p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{hoveredItem.hint}</p>
            </div>
          </div>
        </div>
        <div className="mt-3 flex-1 space-y-3 pr-1">
          {paletteGroups.map((group) => (
            <div key={group.title} className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-3">
              <div className="mb-3">
                <p className="text-sm font-medium text-[var(--text-primary)]">{group.title}</p>
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{group.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/x-darchie-shape', item.shapeKind);
                      event.dataTransfer.setData('text/plain', item.shapeKind);
                      event.dataTransfer.effectAllowed = 'copy';
                    }}
                    onMouseEnter={() => setHoveredItem(item)}
                    onFocus={() => setHoveredItem(item)}
                    onClick={() => onAddShape(item.shapeKind)}
                    title={item.label}
                    aria-label={`Add ${item.label}`}
                    className="group rounded-[16px] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-2.5 text-left transition-colors duration-[130ms] ease-[var(--ease-standard)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)]"
                  >
                    <div className={cn('mx-auto flex h-10 w-10 items-center justify-center rounded-[12px] border transition-colors', getToneClasses(item.tone))}>
                      <item.icon className="size-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function SelectionActionBar({
  selection,
  entities,
  relationships,
  supportShapes,
  onUpdateEntity,
  onUpdateShapeLabel,
  onUpdateShapeSize,
  onSetRelationshipCardinality,
  onDuplicateSelection,
  onCopySelection,
  onDeleteSelection,
  onAddField,
  canPaste,
  onPaste,
  onStartEditing,
}: {
  selection: CanvasSelection;
  entities: DataModelEntity[];
  relationships: DataModelRelationship[];
  supportShapes: SupportingShape[];
  onUpdateEntity: (entityId: string, updates: Partial<Pick<DataModelEntity, 'name' | 'description' | 'persistent'>>) => void;
  onUpdateShapeLabel: (shapeId: string, label: string) => void;
  onUpdateShapeSize: (shapeId: string, size: { width: number; height: number }) => void;
  onSetRelationshipCardinality: (relationshipId: string, cardinality: DataModelRelationshipCardinality) => void;
  onDuplicateSelection: () => void;
  onCopySelection: () => void;
  onDeleteSelection: () => void;
  onAddField: (entityId: string) => void;
  canPaste: boolean;
  onPaste: () => void;
  onStartEditing: () => void;
}) {
  if (!selection) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-3">
        <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">Selection tools</p>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">Select any entity, relationship, or shape on the canvas to edit, duplicate, resize, or delete it.</p>
      </div>
    );
  }

  if (selection.type === 'entity') {
    const entity = entities.find((item) => item.id === selection.id);
    if (!entity) return null;
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[auto_auto_auto_auto]">
            <Button type="button" variant="secondary" size="sm" onClick={() => onAddField(entity.id)} className="h-10">
              <PenSquare className="size-4" />
              Add field
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onStartEditing} className="h-10">
              <PenSquare className="size-4" />
              Rename
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onCopySelection} className="h-10">
              <Copy className="size-4" />
              Copy
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onPaste} disabled={!canPaste} className="h-10">
              <ClipboardPaste className="size-4" />
              Paste
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onDuplicateSelection} className="h-10">
              <Copy className="size-4" />
              Duplicate
            </Button>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onDeleteSelection} className="h-10 text-[var(--accent-error)]">
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    );
  }

  if (selection.type === 'relationship') {
    const relationship = relationships.find((item) => item.id === selection.id);
    if (!relationship) return null;
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Relationship tools</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CARDINALITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onSetRelationshipCardinality(relationship.id, option)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-[130ms] ease-[var(--ease-standard)]',
                    relationship.cardinality === option
                      ? 'border-[var(--border-strong)] bg-[var(--bg-elevated)] text-[var(--text-primary)]'
                      : 'border-[var(--border-soft)] bg-transparent text-[var(--text-secondary)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={onDeleteSelection} className="h-10 text-[var(--accent-error)]">
            Delete
          </Button>
        </div>
      </div>
    );
  }

  const shape = supportShapes.find((item) => item.id === selection.id);
  if (!shape) return null;

  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-4">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] xl:items-end">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]" htmlFor={`selection-shape-label-${shape.id}`}>
            Shape label
          </label>
          <input
            id={`selection-shape-label-${shape.id}`}
            value={shape.label}
            onChange={(event) => onUpdateShapeLabel(shape.id, event.target.value)}
            className="mt-2 h-10 w-full rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-strong)]"
          />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Width</label>
            <input
              type="range"
              min={96}
              max={320}
              step={4}
              value={shape.width}
              onChange={(event) => onUpdateShapeSize(shape.id, { width: Number(event.target.value), height: shape.height })}
              className="mt-2 w-full accent-[var(--accent-primary)]"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">Height</label>
            <input
              type="range"
              min={72}
              max={280}
              step={4}
              value={shape.height}
              onChange={(event) => onUpdateShapeSize(shape.id, { width: shape.width, height: Number(event.target.value) })}
              className="mt-2 w-full accent-[var(--accent-primary)]"
            />
          </div>
        </div>
        <div className="flex gap-2 xl:justify-end">
          <Button type="button" variant="outline" size="sm" onClick={onStartEditing} className="h-10">
            <PenSquare className="size-4" />
            Rename
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onCopySelection} className="h-10">
            <Copy className="size-4" />
            Copy
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onPaste} disabled={!canPaste} className="h-10">
            <ClipboardPaste className="size-4" />
            Paste
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onDuplicateSelection} className="h-10">
            <Copy className="size-4" />
            Duplicate
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onDeleteSelection} className="h-10 text-[var(--accent-error)]">
            <Trash2 className="size-4" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export function DataModelingWorkspace({
  exerciseId,
  initialWorkspace,
}: {
  exerciseId: string;
  initialWorkspace: ExerciseWorkspaceProps;
}) {
  const initialBuilderState = useMemo(
    () => initialWorkspace.builderStarterState ?? { version: 1, entities: [], relationships: [], view: { zoom: 1, x: 0, y: 0 } },
    [initialWorkspace.builderStarterState],
  );
  const [entities, setEntities] = useState<DataModelEntity[]>(initialBuilderState.entities);
  const [relationships, setRelationships] = useState<DataModelRelationship[]>(initialBuilderState.relationships);
  const [supportShapes, setSupportShapes] = useState<SupportingShape[]>([]);
  const [selection, setSelection] = useState<CanvasSelection>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [saveState, setSaveState] = useState(initialWorkspace.saveState);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>(initialWorkspace.feedbackState);
  const [resultModel, setResultModel] = useState<ResultPanelModel>(buildIdleResult(initialWorkspace.resultPanel.summary));
  const [hasDirtyChanges, setHasDirtyChanges] = useState(false);
  const [recentlyAddedLabel, setRecentlyAddedLabel] = useState<string | null>(null);
  const [recentlyAddedNodeId, setRecentlyAddedNodeId] = useState<string | null>(null);
  const [editingTarget, setEditingTarget] = useState<CanvasSelection>(null);
  const [editingFieldTarget, setEditingFieldTarget] = useState<{
    entityId: string;
    fieldId: string;
    mode: 'name' | 'type';
  } | null>(null);
  const [clipboard, setClipboard] = useState<ClipboardEntry>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null);
  const latestSavedPayload = useRef(JSON.stringify({ ...initialBuilderState, supportShapes: [] }));

  useEffect(() => {
    const payload = JSON.stringify({
      version: 1,
      entities,
      relationships,
      supportShapes,
      view: initialBuilderState.view,
    });

    if (payload === latestSavedPayload.current) return;

    setHasDirtyChanges(true);
    setSaveState('Saving draft...');
    const timeout = window.setTimeout(() => {
      latestSavedPayload.current = payload;
      setHasDirtyChanges(false);
      setSaveState('Draft saved in builder preview mode');
    }, 850);

    return () => window.clearTimeout(timeout);
  }, [entities, relationships, supportShapes, initialBuilderState.view]);

  const nodes = useMemo(
    () => [
      ...entities.map((entity) => makeEntityNode(entity, issues, selection?.type === 'entity' && selection.id === entity.id)),
      ...supportShapes.map((shape) => makeShapeNode(shape, selection?.type === 'shape' && selection.id === shape.id)),
    ],
    [entities, supportShapes, issues, selection],
  );

  const edges = useMemo(
    () => relationships.map((relationship) => makeRelationshipEdge(relationship, selection?.type === 'relationship' && selection.id === relationship.id, issues)),
    [relationships, selection, issues],
  );

  useEffect(() => {
    if (!recentlyAddedLabel) return;
    const timeout = window.setTimeout(() => setRecentlyAddedLabel(null), 1600);
    return () => window.clearTimeout(timeout);
  }, [recentlyAddedLabel]);

  useEffect(() => {
    if (!recentlyAddedNodeId) return;
    const timeout = window.setTimeout(() => setRecentlyAddedNodeId(null), 900);
    return () => window.clearTimeout(timeout);
  }, [recentlyAddedNodeId]);

  function getNextCanvasPlacement(kind: ShapeKind) {
    const occupied = [
      ...entities.map((entity) => entity.position),
      ...supportShapes.map((shape) => shape.position),
    ];
    const maxX = occupied.length ? Math.max(...occupied.map((point) => point.x)) : 420;
    const minY = occupied.length ? Math.min(...occupied.map((point) => point.y)) : 120;
    const row = (entities.length + supportShapes.length) % 3;

    if (kind === 'entity') {
      return {
        x: Math.max(220, maxX - 60),
        y: Math.max(90, minY + 180 + (row * 36)),
      };
    }

    return {
      x: Math.max(260, maxX + 120 - (row * 24)),
      y: Math.max(120, minY + 40 + (row * 132)),
    };
  }

  function addPaletteItem(shapeKind: ShapeKind, position?: { x: number; y: number }) {
    const placement = position ?? getNextCanvasPlacement(shapeKind);
    if (shapeKind === 'entity') {
      const entity = createDraftEntity(entities.length, placement);
      setEntities((current) => [...current, entity]);
      setSelection({ type: 'entity', id: entity.id });
      setEditingTarget(null);
      setRecentlyAddedLabel('entity');
      setRecentlyAddedNodeId(entity.id);
      return;
    }

    const item = paletteGroups.flatMap((group) => group.items).find((candidate) => candidate.shapeKind === shapeKind);
    if (!item) return;
    const shape = createSupportingShape(item, supportShapes.length, placement);
    setSupportShapes((current) => [...current, shape]);
    setSelection({ type: 'shape', id: shape.id });
    setEditingTarget(null);
    setRecentlyAddedLabel(item.label);
    setRecentlyAddedNodeId(shape.id);
  }

  function handleNodesChange(changes: NodeChange[]) {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const nextNodes = applyNodeChanges(changes, nodes);

    setEntities((current) =>
      current.map((entity) => {
        const nextNode = nextNodes.find((node) => node.id === entity.id) ?? nodeMap.get(entity.id);
        return nextNode ? { ...entity, position: nextNode.position } : entity;
      }),
    );
    setSupportShapes((current) =>
      current.map((shape) => {
        const nextNode = nextNodes.find((node) => node.id === shape.id) ?? nodeMap.get(shape.id);
        const dimensionChange = changes.find(
          (change): change is Extract<NodeChange, { type: 'dimensions' }> => 'id' in change && change.id === shape.id && change.type === 'dimensions',
        );
        return nextNode
          ? {
              ...shape,
              position: nextNode.position,
              width: typeof dimensionChange?.dimensions?.width === 'number' ? dimensionChange.dimensions.width : shape.width,
              height: typeof dimensionChange?.dimensions?.height === 'number' ? dimensionChange.dimensions.height : shape.height,
            }
          : shape;
      }),
    );
  }

  function handleEdgesChange(changes: EdgeChange[]) {
    const nextEdges = applyEdgeChanges(changes, edges);
    setRelationships((current) => current.filter((relationship) => nextEdges.some((edge) => edge.id === relationship.id)));
  }

  function handleConnect(connection: Connection) {
    if (!connection.source || !connection.target) return;
    const sourceEntity = entities.find((entity) => entity.id === connection.source);
    const targetEntity = entities.find((entity) => entity.id === connection.target);
    if (!sourceEntity || !targetEntity) return;

    const relationship: DataModelRelationship = {
      id: makeId('relationship'),
      sourceEntityId: sourceEntity.id,
      targetEntityId: targetEntity.id,
      sourceFieldId: null,
      targetFieldId: null,
      cardinality: '',
      label: '',
    };
    setRelationships((current) => [...current, relationship]);
    setSelection({ type: 'relationship', id: relationship.id });
  }

  function runValidation(mode: 'validate' | 'submit') {
    const nextIssues = validateWorkspace(exerciseId, entities, relationships);
    setIssues(nextIssues);
    setFeedbackState(nextIssues.some((issue) => issue.severity === 'error') ? 'validationError' : 'success');
    setResultModel(buildReviewResult(mode, nextIssues, entities, relationships, supportShapes));
    return nextIssues;
  }

  function handleSubmit() {
    setFeedbackState('running');
    setResultModel({
      status: 'running',
      summary: 'Preparing mocked architecture review for the current design canvas...',
      tabs: [
        { id: 'validation', label: 'Validation', body: 'Checking ERD structure, keys, and relationship direction.' },
        { id: 'review', label: 'Review', body: 'Reviewing whether support shapes improve the story without diluting the model.' },
        { id: 'explanation', label: 'Explanation', body: 'Submission feedback remains mocked in this redesign slice.' },
      ],
      explanation: 'The core standard is still ERD soundness. The broader canvas should make the design clearer, not looser.',
    });

    window.setTimeout(() => {
      runValidation('submit');
    }, 450);
  }

  function handleReset() {
    setEntities(initialBuilderState.entities);
    setRelationships(initialBuilderState.relationships);
    setSupportShapes([]);
    setSelection(null);
    setIssues([]);
    setFeedbackState('idle');
    setResultModel(buildIdleResult(initialWorkspace.resultPanel.summary));
    latestSavedPayload.current = JSON.stringify({ ...initialBuilderState, supportShapes: [] });
    setHasDirtyChanges(false);
    setSaveState('Canvas reset to the starter architecture frame');
  }

  function deleteSelection() {
    if (!selection) return;
    if (selection.type === 'entity') {
      setEntities((current) => current.filter((entity) => entity.id !== selection.id));
      setRelationships((current) => current.filter((relationship) => relationship.sourceEntityId !== selection.id && relationship.targetEntityId !== selection.id));
    }
    if (selection.type === 'relationship') {
      setRelationships((current) => current.filter((relationship) => relationship.id !== selection.id));
    }
    if (selection.type === 'shape') {
      setSupportShapes((current) => current.filter((shape) => shape.id !== selection.id));
    }
    setSelection(null);
    setEditingTarget(null);
    setContextMenu(null);
  }

  function duplicateSelection() {
    if (!selection) return;

    if (selection.type === 'entity') {
      const entity = entities.find((item) => item.id === selection.id);
      if (!entity) return;
      const duplicated: DataModelEntity = {
        ...entity,
        id: makeId('entity'),
        name: entity.name ? `${entity.name}_copy` : '',
        position: {
          x: entity.position.x + 48,
          y: entity.position.y + 48,
        },
        fields: entity.fields.map((field) => ({
          ...field,
          id: makeId('field'),
        })),
      };
      setEntities((current) => [...current, duplicated]);
      setSelection({ type: 'entity', id: duplicated.id });
      setEditingTarget(null);
      return;
    }

    if (selection.type === 'shape') {
      const shape = supportShapes.find((item) => item.id === selection.id);
      if (!shape) return;
      const duplicated: SupportingShape = {
        ...shape,
        id: makeId(shape.shapeKind),
        label: `${shape.label} copy`,
        position: {
          x: shape.position.x + 48,
          y: shape.position.y + 48,
        },
      };
      setSupportShapes((current) => [...current, duplicated]);
      setSelection({ type: 'shape', id: duplicated.id });
      setEditingTarget(null);
    }
  }

  function copySelection() {
    if (!selection) return;
    if (selection.type === 'entity') {
      const entity = entities.find((item) => item.id === selection.id);
      if (entity) setClipboard({ type: 'entity', entity });
    }
    if (selection.type === 'shape') {
      const shape = supportShapes.find((item) => item.id === selection.id);
      if (shape) setClipboard({ type: 'shape', shape });
    }
    setContextMenu(null);
  }

  function pasteClipboard() {
    if (!clipboard) return;
    if (clipboard.type === 'entity') {
      const duplicated: DataModelEntity = {
        ...clipboard.entity,
        id: makeId('entity'),
        name: clipboard.entity.name ? `${clipboard.entity.name}_copy` : '',
        position: {
          x: clipboard.entity.position.x + 56,
          y: clipboard.entity.position.y + 56,
        },
        fields: clipboard.entity.fields.map((field) => ({
          ...field,
          id: makeId('field'),
        })),
      };
      setEntities((current) => [...current, duplicated]);
      setSelection({ type: 'entity', id: duplicated.id });
      setRecentlyAddedLabel(duplicated.name || 'entity');
      setRecentlyAddedNodeId(duplicated.id);
    }
    if (clipboard.type === 'shape') {
      const duplicated: SupportingShape = {
        ...clipboard.shape,
        id: makeId(clipboard.shape.shapeKind),
        label: `${clipboard.shape.label} copy`,
        position: {
          x: clipboard.shape.position.x + 56,
          y: clipboard.shape.position.y + 56,
        },
      };
      setSupportShapes((current) => [...current, duplicated]);
      setSelection({ type: 'shape', id: duplicated.id });
      setRecentlyAddedLabel(duplicated.label);
      setRecentlyAddedNodeId(duplicated.id);
    }
    setEditingTarget(null);
    setContextMenu(null);
  }

  function setRelationshipCardinality(relationshipId: string, cardinality: DataModelRelationshipCardinality) {
    setRelationships((current) =>
      current.map((relationship) =>
        relationship.id === relationshipId
          ? {
              ...relationship,
              cardinality,
            }
          : relationship,
      ),
    );
  }

  function updateEntity(entityId: string, updates: Partial<Pick<DataModelEntity, 'name' | 'description' | 'persistent'>>) {
    setEntities((current) => current.map((entity) => (entity.id === entityId ? { ...entity, ...updates } : entity)));
  }

  function addField(entityId: string) {
    const nextFieldId = makeId('field');
    setEntities((current) =>
      current.map((entity) =>
        entity.id === entityId
          ? {
              ...entity,
              fields: [
                ...entity.fields,
                {
                  id: nextFieldId,
                  name: '',
                  type: 'string',
                  primaryKey: false,
                  nullable: true,
                  foreignKey: null,
                },
              ],
            }
          : entity,
        ),
    );
    setEditingFieldTarget({ entityId, fieldId: nextFieldId, mode: 'name' });
  }

  function updateField(entityId: string, fieldId: string, updates: Partial<DataModelEntity['fields'][number]>) {
    setEntities((current) =>
      current.map((entity) =>
        entity.id === entityId
          ? {
              ...entity,
              fields: entity.fields.map((field) =>
                field.id === fieldId
                  ? {
                      ...field,
                      ...updates,
                    }
                  : updates.primaryKey
                    ? { ...field, primaryKey: false }
                    : field,
              ),
            }
          : entity,
      ),
    );
  }

  function deleteField(entityId: string, fieldId: string) {
    setEntities((current) =>
      current.map((entity) =>
        entity.id === entityId
          ? {
              ...entity,
              fields: entity.fields.filter((field) => field.id !== fieldId),
            }
          : entity,
      ),
    );
  }

  function updateShapeLabel(shapeId: string, label: string) {
    setSupportShapes((current) => current.map((shape) => (shape.id === shapeId ? { ...shape, label } : shape)));
  }

  function updateShapeSize(shapeId: string, size: { width: number; height: number }) {
    setSupportShapes((current) =>
      current.map((shape) =>
        shape.id === shapeId
          ? {
              ...shape,
              width: size.width,
              height: size.height,
            }
          : shape,
      ),
    );
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) {
        return;
      }

      if ((event.key === 'Delete' || event.key === 'Backspace') && selection) {
        event.preventDefault();
        deleteSelection();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd' && selection) {
        event.preventDefault();
        duplicateSelection();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'c' && selection) {
        event.preventDefault();
        copySelection();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'v' && clipboard) {
        event.preventDefault();
        pasteClipboard();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, clipboard]);

  const issueCounts = {
    errors: issues.filter((issue) => issue.severity === 'error').length,
    warnings: issues.filter((issue) => issue.severity === 'warning').length,
  };

  return (
    <div className="space-y-6">
      <PromptPanel
        sections={initialWorkspace.promptSections}
        starterHint=""
        className="border-[var(--border-strong)] bg-[color-mix(in_oklab,var(--bg-panel)_94%,var(--accent-primary)_6%)] p-4 sm:p-5 [&_.mt-5]:mt-4 [&_.mt-6]:mt-4 [&_.space-y-5]:space-y-4 [&_p]:leading-6"
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-stretch">
        <div className="space-y-6">
          <Panel variant="elevated" className="overflow-hidden p-0">
            <div className="border-b border-[var(--border-soft)] px-5 py-4 sm:px-6">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                Architecture and ERD canvas
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                Build the real data model first, then layer supporting architecture shapes only where they make the design story clearer. The canvas is meant to feel premium, spatial, and presentation-ready.
              </p>
            </div>
            <div className="p-5 sm:p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="neutral">Hybrid design surface</Badge>
                <Badge variant="neutral">ERD-first validation</Badge>
                <Badge variant="neutral">Curated cloud context</Badge>
              </div>
              <ReactFlowProvider>
                <DataModelingCanvas
                  nodes={nodes}
                  edges={edges}
                  selection={selection}
                  entities={entities}
                  relationships={relationships}
                  onNodesChange={handleNodesChange}
                  onEdgesChange={handleEdgesChange}
                  onNodeClick={(nodeId) => {
                    setContextMenu(null);
                    setEditingFieldTarget(null);
                    if (entities.some((entity) => entity.id === nodeId)) {
                      setSelection({ type: 'entity', id: nodeId });
                      return;
                    }
                    setSelection({ type: 'shape', id: nodeId });
                  }}
                  onNodeDoubleClick={(nodeId) => {
                    setContextMenu(null);
                    setEditingFieldTarget(null);
                    if (entities.some((entity) => entity.id === nodeId)) {
                      setSelection({ type: 'entity', id: nodeId });
                      setEditingTarget({ type: 'entity', id: nodeId });
                      return;
                    }
                    setSelection({ type: 'shape', id: nodeId });
                    setEditingTarget({ type: 'shape', id: nodeId });
                  }}
                  onNodeContextMenu={(nodeId, x, y) => {
                    setEditingFieldTarget(null);
                    if (entities.some((entity) => entity.id === nodeId)) {
                      setSelection({ type: 'entity', id: nodeId });
                      setContextMenu({ x, y, target: { type: 'entity', id: nodeId } });
                      return;
                    }
                    setSelection({ type: 'shape', id: nodeId });
                    setContextMenu({ x, y, target: { type: 'shape', id: nodeId } });
                  }}
                  onEdgeClick={(edgeId) => setSelection({ type: 'relationship', id: edgeId })}
                  onPaneClick={() => {
                    setSelection(null);
                    setEditingTarget(null);
                    setEditingFieldTarget(null);
                    setContextMenu(null);
                  }}
                  onConnect={handleConnect}
                  onDropPaletteItem={addPaletteItem}
                  recentlyAddedLabel={recentlyAddedLabel}
                  recentlyAddedNodeId={recentlyAddedNodeId}
                  editingTarget={editingTarget}
                  editingFieldTarget={editingFieldTarget}
                  onStartFieldEditing={(entityId, fieldId, mode) => setEditingFieldTarget({ entityId, fieldId, mode })}
                  onFinishFieldEditing={() => setEditingFieldTarget(null)}
                  onUpdateField={updateField}
                  onLabelChange={(id, value) => {
                    if (entities.some((entity) => entity.id === id)) {
                      updateEntity(id, { name: value });
                      return;
                    }
                    updateShapeLabel(id, value);
                  }}
                  onFinishEditing={() => setEditingTarget(null)}
                  contextMenu={contextMenu}
                  canPaste={!!clipboard}
                  onCopySelection={copySelection}
                  onPaste={pasteClipboard}
                  onDuplicateSelection={duplicateSelection}
                  onDeleteSelection={deleteSelection}
                  onAddField={addField}
                  onSetRelationshipCardinality={setRelationshipCardinality}
                />
              </ReactFlowProvider>
              <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={issueCounts.errors ? 'warning' : 'neutral'}>{issueCounts.errors} errors</Badge>
                    <Badge variant={issueCounts.warnings ? 'info' : 'neutral'}>{issueCounts.warnings} warnings</Badge>
                    <Badge variant="neutral">{entities.length} ERD entities</Badge>
                    <Badge variant="neutral">{relationships.length} relationships</Badge>
                    <Badge variant="neutral">{supportShapes.length} support shapes</Badge>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Button size="lg" variant="outline" onClick={handleReset} className="w-full">
                      <RefreshCcw className="size-4" />
                      Reset
                    </Button>
                    <Button size="lg" variant="secondary" onClick={() => runValidation('validate')} className="w-full">
                      <ShieldCheck className="size-4" />
                      Validate
                    </Button>
                    <Button size="lg" onClick={handleSubmit} className="w-full">
                      <Send className="size-4" />
                      Submit
                    </Button>
                  </div>
                  <WorkspaceStatusBar saveState={hasDirtyChanges ? 'Saving draft...' : saveState} feedbackState={feedbackState} className="bg-[var(--bg-elevated)]" />
                </div>
              </div>
            </div>
          </Panel>
          <ResultPanel model={resultModel} />
        </div>
        <BuilderPalette onAddShape={(shapeKind) => addPaletteItem(shapeKind)} />
      </div>
    </div>
  );
}
