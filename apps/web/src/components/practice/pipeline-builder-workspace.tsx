'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Handle,
  MarkerType,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  type Connection,
  type Edge,
  type Node,
  type NodeChange,
  type NodeProps,
} from '@xyflow/react';
import { Minus, Plus, RefreshCcw, Search, Send, ShieldCheck, Play } from 'lucide-react';
import { pipelineShapeGroups, pipelineShapeIndex, type ArchitectureShapeDefinition } from '@/lib/architecture-shapes';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/panel';
import { ResultPanel } from '@/components/practice/result-panel';
import { WorkspaceStatusBar } from '@/components/practice/workspace-status-bar';
import type {
  ExerciseWorkspaceProps,
  FeedbackState,
  PipelineBuilderEdge,
  PipelineBuilderNode,
  PipelineNodeProvider,
  PipelineNodeRole,
  ResultPanelModel,
} from '@/types/practice';

type PipelineSelection = { type: 'node' | 'edge'; id: string } | null;

type PipelineIssue = {
  id: string;
  severity: 'error' | 'warning';
  issue: string;
  why: string;
  suggestedFix: string;
  target?: PipelineSelection;
};

type PipelineNodeData = {
  id: string;
  label: string;
  hint: string;
  configSummary: string;
  provider: PipelineNodeProvider;
  role: PipelineNodeRole;
  shapeKind: PipelineBuilderNode['shapeKind'];
  selected: boolean;
  width: number;
  height: number;
  definition: ArchitectureShapeDefinition;
  editingLabel: boolean;
  editingConfig: boolean;
  onSelect: (id: string) => void;
  onStartLabelEdit: (id: string) => void;
  onStartConfigEdit: (id: string) => void;
  onFinishEditing: () => void;
  onUpdateLabel: (id: string, value: string) => void;
  onUpdateConfig: (id: string, value: string) => void;
};

type BuilderSnapshot = {
  nodes: PipelineBuilderNode[];
  edges: PipelineBuilderEdge[];
  notes: string;
};

function makeId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function cloneSnapshot(snapshot: BuilderSnapshot): BuilderSnapshot {
  return {
    nodes: snapshot.nodes.map((node) => ({ ...node, position: { ...node.position } })),
    edges: snapshot.edges.map((edge) => ({ ...edge })),
    notes: snapshot.notes,
  };
}

function isFailureCapable(role: PipelineNodeRole) {
  return role === 'transform' || role === 'join' || role === 'filter' || role === 'aggregate' || role === 'quality-check' || role === 'branch';
}

function isPipelineNode(role: PipelineNodeRole) {
  return role !== 'support';
}

function providerBadge(provider: PipelineNodeProvider) {
  if (provider === 'aws') return 'AWS';
  if (provider === 'azure') return 'Azure';
  if (provider === 'platform') return 'Platform';
  return 'Neutral';
}

function nodeToneClasses(provider: PipelineNodeProvider, role: PipelineNodeRole) {
  if (provider === 'aws') {
    return 'border-[color-mix(in_oklab,var(--accent-secondary)_30%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-panel)_92%,var(--accent-secondary)_8%)]';
  }
  if (provider === 'azure') {
    return 'border-[color-mix(in_oklab,var(--accent-primary)_34%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-panel)_92%,var(--accent-primary)_8%)]';
  }
  if (role === 'quality-check' || role === 'alert') {
    return 'border-[color-mix(in_oklab,var(--accent-secondary)_28%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-panel)_93%,var(--accent-secondary)_7%)]';
  }
  return 'border-[var(--border-soft)] bg-[var(--bg-panel)]';
}

function buildIdleResult(summary: string): ResultPanelModel {
  return {
    status: 'idle',
    summary,
    tabs: [
      { id: 'validation', label: 'Validation', body: 'Validate the graph to inspect dependency logic, root nodes, and failure routing.' },
      { id: 'simulation', label: 'Simulation', body: 'Simulate to preview execution order, guarded failure paths, and where alerting becomes active.' },
      { id: 'explanation', label: 'Explanation', body: 'Strong pipeline answers explain why the orchestration shape is safe, not only what runs first.' },
    ],
    explanation: 'This workspace should feel like a data-platform architecture board where shape choice, dependency logic, and failure reasoning all reinforce one another.',
  };
}

function validatePipelineGraph(nodes: PipelineBuilderNode[], edges: PipelineBuilderEdge[]): PipelineIssue[] {
  const issues: PipelineIssue[] = [];
  const nodeMap = new Map(nodes.map((node) => [node.id, node]));
  const pipelineNodes = nodes.filter((node) => isPipelineNode(node.role));
  const pipelineNodeIds = new Set(pipelineNodes.map((node) => node.id));
  const relevantEdges = edges.filter((edge) => pipelineNodeIds.has(edge.sourceNodeId) && pipelineNodeIds.has(edge.targetNodeId));
  const incoming = new Map<string, string[]>();
  const outgoing = new Map<string, string[]>();

  for (const node of pipelineNodes) {
    incoming.set(node.id, []);
    outgoing.set(node.id, []);
    if (!node.label.trim()) {
      issues.push({
        id: `${node.id}-missing-label`,
        severity: 'error',
        issue: 'A pipeline node is missing a label.',
        why: 'Unnamed pipeline steps make orchestration reasoning hard to defend in an interview.',
        suggestedFix: 'Give every pipeline node a clear job-style label.',
        target: { type: 'node', id: node.id },
      });
    }
    if (!node.configSummary.trim()) {
      issues.push({
        id: `${node.id}-missing-config`,
        severity: 'error',
        issue: `${node.label || 'Node'} is missing config context.`,
        why: 'Interviewers need to understand what that step is doing, not only its shape.',
        suggestedFix: 'Add a short config summary such as a bucket path, job name, table, or SLA route.',
        target: { type: 'node', id: node.id },
      });
    }
  }

  for (const edge of relevantEdges) {
    incoming.get(edge.targetNodeId)?.push(edge.sourceNodeId);
    outgoing.get(edge.sourceNodeId)?.push(edge.targetNodeId);
  }

  for (const node of pipelineNodes) {
    const inbound = incoming.get(node.id) ?? [];
    const outbound = outgoing.get(node.id) ?? [];
    const inboundWithoutSchedulers = inbound.filter((sourceId) => nodeMap.get(sourceId)?.role !== 'scheduler-trigger');

    if (node.role === 'source' && inboundWithoutSchedulers.length > 0) {
      issues.push({
        id: `${node.id}-source-inbound`,
        severity: 'error',
        issue: `${node.label} is a source node but has inbound dependencies.`,
        why: 'Sources should begin the pipeline rather than consume upstream work.',
        suggestedFix: 'Remove inbound edges or change the node role to a downstream processing step.',
        target: { type: 'node', id: node.id },
      });
    }

    if (node.role === 'sink' && outbound.length > 0) {
      issues.push({
        id: `${node.id}-sink-outbound`,
        severity: 'error',
        issue: `${node.label} is a sink node but emits downstream edges.`,
        why: 'Sinks should terminate or publish results rather than continue the core ETL path.',
        suggestedFix: 'Remove outbound edges or recast the node as an intermediate transformation stage.',
        target: { type: 'node', id: node.id },
      });
    }

    if (node.role === 'scheduler-trigger') {
      if (inboundWithoutSchedulers.length > 0) {
        issues.push({
          id: `${node.id}-scheduler-inbound`,
          severity: 'error',
          issue: `${node.label} is a scheduler trigger but receives inbound edges.`,
          why: 'Triggers should sit at the root of the DAG.',
          suggestedFix: 'Remove inbound edges so the trigger starts the flow cleanly.',
          target: { type: 'node', id: node.id },
        });
      }

      for (const targetId of outbound) {
        const targetInbound = (incoming.get(targetId) ?? []).filter((sourceId) => sourceId !== node.id && nodeMap.get(sourceId)?.role !== 'scheduler-trigger');
        if (targetInbound.length > 0) {
          issues.push({
            id: `${node.id}-${targetId}-scheduler-root`,
            severity: 'error',
            issue: `${node.label} points to a non-root pipeline node.`,
            why: 'Scheduler triggers should attach only to root nodes so dependency ordering stays legible.',
            suggestedFix: 'Reconnect the trigger to the actual root of the run or remove the extra upstream dependency.',
            target: { type: 'edge', id: `${node.id}-${targetId}` },
          });
        }
      }
    }

    if (node.role === 'alert') {
      for (const sourceId of inbound) {
        const sourceNode = nodeMap.get(sourceId);
        if (sourceNode && !isFailureCapable(sourceNode.role)) {
          issues.push({
            id: `${node.id}-${sourceId}-alert-source`,
            severity: 'error',
            issue: `${node.label} is connected from a step that is not modeled as failure-capable.`,
            why: 'Alert paths should explain a credible failure or SLA breach source.',
            suggestedFix: 'Route alerting from a quality gate, branch, or transform step that can plausibly fail.',
            target: { type: 'node', id: node.id },
          });
        }
      }
    }
  }

  const indegree = new Map<string, number>(pipelineNodes.map((node) => [node.id, incoming.get(node.id)?.length ?? 0]));
  const queue = pipelineNodes.filter((node) => (indegree.get(node.id) ?? 0) === 0).map((node) => node.id);
  let visited = 0;

  while (queue.length > 0) {
    const nodeId = queue.shift();
    if (!nodeId) continue;
    visited += 1;
    for (const nextId of outgoing.get(nodeId) ?? []) {
      indegree.set(nextId, (indegree.get(nextId) ?? 0) - 1);
      if ((indegree.get(nextId) ?? 0) === 0) queue.push(nextId);
    }
  }

  if (visited < pipelineNodes.length) {
    issues.push({
      id: 'pipeline-cycle',
      severity: 'error',
      issue: 'The pipeline graph contains a cycle.',
      why: 'Cycles make scheduling and replay logic ambiguous in interview DAG questions.',
      suggestedFix: 'Break the cycle so the graph has a clear topological execution order.',
      target: { type: 'edge', id: relevantEdges[0]?.id ?? '' },
    });
  }

  if (pipelineNodes.filter((node) => node.role !== 'scheduler-trigger').length > 0 && pipelineNodes.every((node) => (incoming.get(node.id) ?? []).length > 0)) {
    issues.push({
      id: 'no-root-node',
      severity: 'warning',
      issue: 'The graph has no obvious non-trigger root node.',
      why: 'Even with a scheduler, interviewers expect one or more clear root execution steps.',
      suggestedFix: 'Leave at least one source or entry node with no non-trigger upstream dependency.',
      target: { type: 'node', id: pipelineNodes[0]?.id ?? '' },
    });
  }

  return issues;
}

function buildReviewResult(kind: 'validate' | 'simulate' | 'submit', issues: PipelineIssue[], nodes: PipelineBuilderNode[], edges: PipelineBuilderEdge[]): ResultPanelModel {
  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');
  const pipelineNodes = nodes.filter((node) => isPipelineNode(node.role));

  if (kind === 'simulate' && errors.length === 0) {
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));
    const relevantEdges = edges.filter((edge) => nodeMap.get(edge.sourceNodeId) && nodeMap.get(edge.targetNodeId) && isPipelineNode(nodeMap.get(edge.sourceNodeId)!.role) && isPipelineNode(nodeMap.get(edge.targetNodeId)!.role));
    const indegree = new Map<string, number>(pipelineNodes.map((node) => [node.id, 0]));
    const outgoing = new Map<string, string[]>();

    for (const node of pipelineNodes) outgoing.set(node.id, []);
    for (const edge of relevantEdges) {
      indegree.set(edge.targetNodeId, (indegree.get(edge.targetNodeId) ?? 0) + 1);
      outgoing.get(edge.sourceNodeId)?.push(edge.targetNodeId);
    }

    const queue = pipelineNodes.filter((node) => (indegree.get(node.id) ?? 0) === 0).map((node) => node.id);
    const executionOrder: string[] = [];

    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (!nodeId) continue;
      executionOrder.push(nodeId);
      for (const nextId of outgoing.get(nodeId) ?? []) {
        indegree.set(nextId, (indegree.get(nextId) ?? 0) - 1);
        if ((indegree.get(nextId) ?? 0) === 0) queue.push(nextId);
      }
    }

    const timeline = executionOrder
      .map((nodeId, index) => {
        const node = nodeMap.get(nodeId);
        return `${index + 1}. ${node?.label} — ${node?.configSummary}`;
      })
      .join('\n');

    const dormantAlerts = pipelineNodes.filter((node) => node.role === 'alert');

    return {
      status: 'success',
      summary: 'Simulation path is ready for the current DAG.',
      tabs: [
        { id: 'validation', label: 'Validation', body: warnings.length ? warnings.map((issue) => `Issue: ${issue.issue}\nWhy it matters: ${issue.why}\nSuggested fix: ${issue.suggestedFix}`).join('\n\n') : 'No blocking graph issues were found before simulation.', status: warnings.length ? 'warning' : 'success' },
        { id: 'simulation', label: 'Simulation', body: timeline || 'No runnable pipeline nodes found.', status: 'success' },
        { id: 'explanation', label: 'Explanation', body: dormantAlerts.length ? `Alert path remains armed but dormant until a failure-capable step routes to it.\n\nAlert nodes present: ${dormantAlerts.map((node) => node.label).join(', ')}` : 'The mocked simulation focuses on execution order and failure-path readability rather than real orchestration runtime.', status: 'neutral' },
      ],
      explanation: 'Use the simulation to defend execution order, not just box placement. The strongest answers explain where failure should stop the run versus where it should notify and continue.',
    };
  }

  return {
    status: errors.length ? 'validationError' : 'success',
    summary: errors.length
      ? `${errors.length} blocking graph issue${errors.length === 1 ? '' : 's'} need attention.`
      : kind === 'submit'
        ? 'Submission review is ready for the current pipeline architecture.'
        : 'Validation passed for the current pipeline graph.',
    tabs: [
      {
        id: 'validation',
        label: 'Validation',
        body: errors.length
          ? errors.map((issue) => `Issue: ${issue.issue}\nWhy it matters: ${issue.why}\nSuggested fix: ${issue.suggestedFix}`).join('\n\n')
          : 'No blocking graph issues were found.',
        status: errors.length ? 'warning' : 'success',
      },
      {
        id: 'simulation',
        label: 'Simulation',
        body: warnings.length
          ? warnings.map((issue) => `Issue: ${issue.issue}\nWhy it matters: ${issue.why}\nSuggested fix: ${issue.suggestedFix}`).join('\n\n')
          : `Pipeline nodes on canvas: ${pipelineNodes.length}\nConnections modeled: ${edges.length}`,
        status: warnings.length ? 'warning' : 'neutral',
      },
      {
        id: 'explanation',
        label: 'Explanation',
        body: errors.length
          ? 'Fix the structural DAG issues first. A premium-looking graph still needs credible dependency logic and failure routing.'
          : 'The mocked review rewards clean dependency order, explicit quality gates, and believable escalation paths rather than decorative architecture alone.',
        status: 'neutral',
      },
    ],
    explanation: errors.length
      ? 'Break the graph problems first, then use branded infrastructure shapes to sharpen the architecture story.'
      : 'Strong pipeline answers show what runs, what blocks publish, and where alerting or observability takes over when the happy path breaks.',
  };
}

function PipelineCanvasNode({ data, selected }: NodeProps<Node<PipelineNodeData>>) {
  const ShapeIcon = data.definition.icon;
  const isSelected = selected || data.selected;
  const isBoundary = data.shapeKind === 'aws-boundary' || data.shapeKind === 'azure-boundary' || data.shapeKind === 'platform-boundary';
  const isNote = data.shapeKind === 'note';

  return (
    <div
      className={cn(
        'group relative cursor-grab rounded-[var(--radius-lg)] border shadow-[var(--shadow-soft)] transition-all duration-[180ms] ease-[var(--ease-standard)] active:cursor-grabbing',
        nodeToneClasses(data.provider, data.role),
        isBoundary && 'border-dashed bg-[color-mix(in_oklab,var(--bg-panel)_86%,transparent)]',
        isNote && 'border-dashed',
        isSelected && 'ring-2 ring-[color-mix(in_oklab,var(--accent-primary)_45%,transparent)] shadow-[0_0_0_1px_color-mix(in_oklab,var(--accent-primary)_18%,transparent),var(--shadow-panel)]',
      )}
      style={{ width: data.width, minHeight: data.height }}
      onMouseDownCapture={(event) => {
        if ((event.target as HTMLElement).closest('.react-flow__handle,.nodrag,.nopan,input,button,textarea,select')) {
          return;
        }
        data.onSelect(data.id);
      }}
    >
      {data.role !== 'support' ? (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="!size-5 !border-2 !border-[var(--bg-panel)] !bg-[var(--accent-primary)] shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent-primary)_12%,transparent)]"
          />
          <Handle
            type="source"
            position={Position.Right}
            className="!size-5 !border-2 !border-[var(--bg-panel)] !bg-[var(--accent-secondary)] shadow-[0_0_0_4px_color-mix(in_oklab,var(--accent-secondary)_12%,transparent)]"
          />
        </>
      ) : null}
      <div className="flex h-full flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="rounded-[14px] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_78%,transparent)] p-2.5 text-[var(--text-primary)]">
              <ShapeIcon className="size-5" />
            </div>
            <div className="min-w-0">
              <Badge variant="neutral">{providerBadge(data.provider)}</Badge>
              {data.editingLabel ? (
                <input
                  autoFocus
                  value={data.label}
                  onChange={(event) => data.onUpdateLabel(data.id, event.target.value)}
                  onBlur={data.onFinishEditing}
                  className="nodrag nopan mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-2.5 py-2 text-sm font-semibold text-[var(--text-primary)] outline-none"
                />
              ) : (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    data.onStartLabelEdit(data.id);
                  }}
                  className="nodrag nopan mt-2 block text-left font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]"
                >
                  {data.label}
                </button>
              )}
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{data.role.replace('-', ' ')}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_78%,var(--bg-elevated))] px-3 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{isNote ? 'Note body' : isBoundary ? 'Boundary summary' : 'Config summary'}</p>
          {data.editingConfig ? (
            <input
              autoFocus
              value={data.configSummary}
              onChange={(event) => data.onUpdateConfig(data.id, event.target.value)}
              onBlur={data.onFinishEditing}
              className="nodrag nopan mt-2 w-full rounded-[var(--radius-sm)] border border-[var(--border-soft)] bg-[var(--bg-panel)] px-2.5 py-2 text-sm text-[var(--text-primary)] outline-none"
            />
          ) : (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                data.onStartConfigEdit(data.id);
              }}
              className="nodrag nopan mt-2 block text-left text-sm leading-6 text-[var(--text-secondary)]"
            >
              {data.configSummary}
            </button>
          )}
        </div>
        {!isBoundary ? <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{data.hint}</p> : null}
      </div>
    </div>
  );
}

function PipelineCanvas({
  nodes,
  edges,
  selected,
  onNodesChange,
  onSelectNode,
  onSelectEdge,
  onPaneClick,
  onConnectNodes,
  onAddShapeFromDrop,
  onStartLabelEdit,
  onStartConfigEdit,
  onFinishEditing,
  onUpdateLabel,
  onUpdateConfig,
  editingTarget,
  setZoomPercent,
}: {
  nodes: PipelineBuilderNode[];
  edges: PipelineBuilderEdge[];
  selected: PipelineSelection;
  onNodesChange: (changes: NodeChange[]) => void;
  onSelectNode: (nodeId: string) => void;
  onSelectEdge: (edgeId: string) => void;
  onPaneClick: () => void;
  onConnectNodes: (connection: Connection) => void;
  onAddShapeFromDrop: (shapeKind: string, position: { x: number; y: number }) => void;
  onStartLabelEdit: (nodeId: string) => void;
  onStartConfigEdit: (nodeId: string) => void;
  onFinishEditing: () => void;
  onUpdateLabel: (nodeId: string, value: string) => void;
  onUpdateConfig: (nodeId: string, value: string) => void;
  editingTarget: { type: 'label' | 'config'; id: string } | null;
  setZoomPercent: (value: number) => void;
}) {
  const { screenToFlowPosition } = useReactFlow();
  const [isClientReady, setIsClientReady] = useState(false);

  useEffect(() => {
    setIsClientReady(true);
  }, []);

  const flowNodes: Array<Node<PipelineNodeData>> = useMemo(
    () =>
      nodes.map((node) => {
        const definition = pipelineShapeIndex.find((item) => item.shapeKind === node.shapeKind)!;
        return {
          id: node.id,
          type: 'pipeline-node',
          position: node.position,
          initialWidth: node.width,
          initialHeight: node.height,
          sourcePosition: Position.Right,
          targetPosition: Position.Left,
          data: {
            ...node,
            definition,
            selected: selected?.type === 'node' && selected.id === node.id,
            editingLabel: editingTarget?.type === 'label' && editingTarget.id === node.id,
            editingConfig: editingTarget?.type === 'config' && editingTarget.id === node.id,
            onSelect: onSelectNode,
            onStartLabelEdit,
            onStartConfigEdit,
            onFinishEditing,
            onUpdateLabel,
            onUpdateConfig,
          },
        };
      }),
    [nodes, selected, editingTarget, onSelectNode, onStartLabelEdit, onStartConfigEdit, onFinishEditing, onUpdateLabel, onUpdateConfig],
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((edge) => ({
        id: edge.id,
        source: edge.sourceNodeId,
        target: edge.targetNodeId,
        label: edge.label,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'var(--accent-primary)',
        },
        style: {
          stroke: selected?.type === 'edge' && selected.id === edge.id ? 'var(--accent-secondary)' : 'var(--accent-primary)',
          strokeWidth: selected?.type === 'edge' && selected.id === edge.id ? 2.8 : 2.1,
        },
        labelStyle: {
          fill: 'var(--text-primary)',
          fontSize: 12,
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: 'var(--bg-panel)',
          fillOpacity: 0.94,
          stroke: 'var(--border-soft)',
        },
      })),
    [edges, selected],
  );

  return (
    <div className="relative h-[760px] overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border-soft)] bg-[radial-gradient(circle_at_top_left,color-mix(in_oklab,var(--accent-primary)_9%,transparent),transparent_34%),linear-gradient(180deg,color-mix(in_oklab,var(--bg-elevated)_54%,var(--bg-panel))_0%,var(--bg-panel)_100%)]">
      {isClientReady ? (
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={{ 'pipeline-node': PipelineCanvasNode }}
          onNodesChange={onNodesChange}
          connectionMode={ConnectionMode.Loose}
          onNodeClick={(_event, node) => onSelectNode(node.id)}
          onEdgeClick={(_event, edge) => onSelectEdge(edge.id)}
          onPaneClick={onPaneClick}
          onConnect={onConnectNodes}
          onMoveEnd={(_event, viewport) => setZoomPercent(Math.round(viewport.zoom * 100))}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }}
          onDrop={(event) => {
            event.preventDefault();
            const shapeKind = event.dataTransfer.getData('application/x-darchie-shape') || event.dataTransfer.getData('text/plain');
            if (!shapeKind) return;
            const canvasRect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
            onAddShapeFromDrop(shapeKind, screenToFlowPosition({ x: event.clientX - canvasRect.left, y: event.clientY - canvasRect.top }));
          }}
          defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
          minZoom={0.3}
          maxZoom={1.9}
          fitView={false}
          selectionOnDrag
          elementsSelectable
          elevateNodesOnSelect
          connectionLineStyle={{ stroke: 'var(--accent-secondary)', strokeWidth: 2.8 }}
          elevateEdgesOnSelect
          proOptions={{ hideAttribution: true }}
          className="!bg-transparent"
        >
          <Background variant={BackgroundVariant.Dots} color="color-mix(in oklab, var(--accent-primary) 22%, transparent)" gap={22} size={1.8} />
        </ReactFlow>
      ) : null}
    </div>
  );
}

function PipelineBuilderPalette({
  query,
  onQueryChange,
  onAddShape,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  onAddShape: (shapeKind: PipelineBuilderNode['shapeKind']) => void;
}) {
  const [hoveredItem, setHoveredItem] = useState<ArchitectureShapeDefinition>(pipelineShapeIndex[0]);

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return pipelineShapeGroups;
    return pipelineShapeGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) =>
          [item.label, item.provider, item.category, item.shapeKind, ...item.keywords].some((value) => value.toLowerCase().includes(normalized)),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [query]);

  const PreviewIcon = hoveredItem.icon;

  return (
    <div className="self-stretch xl:sticky xl:top-6 xl:self-start">
      <Panel variant="default" className="flex overflow-hidden p-5 sm:p-6 xl:h-[calc(100vh-3rem)] xl:min-h-[720px] xl:max-h-[calc(100vh-3rem)] xl:flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)]">Builder palette</p>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">Hover to inspect. Click to Add OR Drag onto canvas.</p>
          </div>
        </div>
        <label className="mt-5 flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-3 py-3">
          <Search className="size-4 text-[var(--text-muted)]" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search shapes, providers, or keywords"
            className="w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)]"
          />
        </label>
        <div className="mt-4 rounded-[18px] border border-[color-mix(in_oklab,var(--accent-secondary)_20%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-elevated)_94%,var(--accent-secondary)_6%)] px-3 py-2.5">
          <div className="flex items-start gap-3">
            <div className="rounded-[12px] border border-[color-mix(in_oklab,var(--accent-secondary)_20%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-panel)_90%,var(--accent-secondary)_10%)] p-2">
              <PreviewIcon className="size-4 text-[var(--accent-secondary)]" />
            </div>
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-heading)] text-base font-semibold tracking-[-0.03em] text-[var(--accent-secondary)]">
                {hoveredItem.label}
              </p>
              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{hoveredItem.hint}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-full border border-[color-mix(in_oklab,var(--accent-primary)_22%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-panel)_90%,var(--accent-primary)_10%)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-primary)]">
                  {hoveredItem.provider}
                </span>
                <span className="rounded-full border border-[color-mix(in_oklab,var(--accent-secondary)_24%,var(--border-soft))] bg-[color-mix(in_oklab,var(--bg-panel)_90%,var(--accent-secondary)_10%)] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-secondary)]">
                  {hoveredItem.category}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
          <div className="space-y-5">
            {filteredGroups.map((group) => (
              <div key={group.id} className="rounded-[var(--radius-lg)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] p-4">
                <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">{group.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{group.description}</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {group.items.map((item) => {
                    const ItemIcon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        draggable
                        onDragStart={(event) => {
                          event.dataTransfer.setData('application/x-darchie-shape', item.shapeKind);
                          event.dataTransfer.setData('text/plain', item.shapeKind);
                        }}
                        onMouseEnter={() => setHoveredItem(item)}
                        onFocus={() => setHoveredItem(item)}
                        onClick={() => onAddShape(item.shapeKind)}
                        className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] p-3 text-left transition-colors duration-[130ms] ease-[var(--ease-standard)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-surface)]"
                        aria-label={`Add ${item.label}`}
                        title={`${item.label} — ${item.hint}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="rounded-[14px] border border-[var(--border-soft)] bg-[color-mix(in_oklab,var(--bg-panel)_84%,transparent)] p-2.5">
                            <ItemIcon className="size-5 text-[var(--text-primary)]" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</p>
                            <p className="mt-1 text-xs leading-6 text-[var(--text-muted)]">{item.provider}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>
    </div>
  );
}

function PipelineBuilderWorkspaceInner({ initialWorkspace }: { exerciseId: string; initialWorkspace: ExerciseWorkspaceProps }) {
  const starter = initialWorkspace.pipelineStarterState;
  const { setCenter, zoomIn, zoomOut } = useReactFlow();

  if (!starter) {
    throw new Error('Pipeline starter state is required for PipelineBuilderWorkspace.');
  }

  const initialSnapshotRef = useRef<BuilderSnapshot>({
    nodes: starter.nodes,
    edges: starter.edges,
    notes: starter.notes,
  });

  const [nodes, setNodes] = useState<PipelineBuilderNode[]>(starter.nodes);
  const [edges, setEdges] = useState<PipelineBuilderEdge[]>(starter.edges);
  const [notes, setNotes] = useState(starter.notes);
  const [selection, setSelection] = useState<PipelineSelection>(null);
  const [editingTarget, setEditingTarget] = useState<{ type: 'label' | 'config'; id: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [saveState, setSaveState] = useState(initialWorkspace.saveState);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>(initialWorkspace.feedbackState);
  const [issues, setIssues] = useState<PipelineIssue[]>([]);
  const [resultPanel, setResultPanel] = useState<ResultPanelModel>(initialWorkspace.resultPanel);
  const [zoomPercent, setZoomPercent] = useState(40);

  const updateNode = useCallback((nodeId: string, updater: (node: PipelineBuilderNode) => PipelineBuilderNode) => {
    setNodes((current) => current.map((node) => (node.id === nodeId ? updater(node) : node)));
    setSaveState('Draft updated locally');
  }, []);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    setNodes((current) => {
      const flowNodes = current.map((node) => ({
        id: node.id,
        position: node.position,
        width: node.width,
        height: node.height,
        data: node,
      }));
      const nextNodes = applyNodeChanges(changes, flowNodes);

      const changedPosition = changes.some((change) => change.type === 'position');
      const changedDimensions = changes.some((change) => change.type === 'dimensions');

      const mapped = current.map((node) => {
        const next = nextNodes.find((candidate) => candidate.id === node.id);
        if (!next) return node;
        return {
          ...node,
          position: next.position ?? node.position,
          width: typeof next.width === 'number' ? next.width : node.width,
          height: typeof next.height === 'number' ? next.height : node.height,
        };
      });

      if (changedPosition) {
        setSaveState('Pipeline layout updated locally');
      } else if (changedDimensions) {
        setSaveState('Node size updated locally');
      }

      return mapped;
    });
  }, []);

  const addShape = useCallback(
    (shapeKind: PipelineBuilderNode['shapeKind'], position?: { x: number; y: number }) => {
      const definition = pipelineShapeIndex.find((item) => item.shapeKind === shapeKind);
      if (!definition) return;
      const nextIndex = nodes.length;
      const nextNode: PipelineBuilderNode = {
        id: makeId(shapeKind),
        shapeKind: definition.shapeKind,
        label: definition.label,
        provider: definition.provider,
        category: definition.category,
        role: definition.role,
        hint: definition.hint,
        configSummary: definition.configSummary,
        position:
          position ?? {
            x: 120 + ((nextIndex % 3) * 280),
            y: 140 + (Math.floor(nextIndex / 3) * 190),
          },
        width: definition.width,
        height: definition.height,
      };
      setNodes((current) => [...current, nextNode]);
      setSelection({ type: 'node', id: nextNode.id });
      setEditingTarget(null);
      setSaveState(`${definition.label} added to the canvas`);
      setTimeout(() => {
        setCenter(nextNode.position.x + (nextNode.width / 2), nextNode.position.y + (nextNode.height / 2), { duration: 350, zoom: Math.max(0.45, starter.view.zoom) });
      }, 0);
    },
    [nodes.length, setCenter, starter.view.zoom],
  );

  const validate = useCallback(() => {
    const nextIssues = validatePipelineGraph(nodes, edges);
    setIssues(nextIssues);
    setFeedbackState(nextIssues.some((issue) => issue.severity === 'error') ? 'validationError' : 'success');
    setResultPanel(buildReviewResult('validate', nextIssues, nodes, edges));
  }, [nodes, edges]);

  const simulate = useCallback(() => {
    const nextIssues = validatePipelineGraph(nodes, edges);
    setIssues(nextIssues);
    if (nextIssues.some((issue) => issue.severity === 'error')) {
      setFeedbackState('validationError');
      setResultPanel(buildReviewResult('validate', nextIssues, nodes, edges));
      return;
    }
    setFeedbackState('success');
    setResultPanel(buildReviewResult('simulate', nextIssues, nodes, edges));
  }, [nodes, edges]);

  const submit = useCallback(() => {
    const nextIssues = validatePipelineGraph(nodes, edges);
    setIssues(nextIssues);
    setFeedbackState(nextIssues.some((issue) => issue.severity === 'error') ? 'validationError' : 'success');
    setResultPanel(buildReviewResult('submit', nextIssues, nodes, edges));
  }, [nodes, edges]);

  const resetWorkspace = useCallback(() => {
    const snapshot = cloneSnapshot(initialSnapshotRef.current);
    setNodes(snapshot.nodes);
    setEdges(snapshot.edges);
    setNotes(snapshot.notes);
    setSelection(null);
    setEditingTarget(null);
    setIssues([]);
    setFeedbackState('idle');
    setResultPanel(buildIdleResult(initialWorkspace.resultPanel.summary));
    setSaveState('Starter pipeline restored');
    setZoomPercent(40);
  }, [initialWorkspace.resultPanel.summary]);

  const handleConnect = useCallback((connection: Connection) => {
    if (!connection.source || !connection.target || connection.source === connection.target) return;
    const source = nodes.find((node) => node.id === connection.source);
    const target = nodes.find((node) => node.id === connection.target);
    if (!source || !target) return;
    const label = source.role === 'scheduler-trigger' ? 'schedule start' : target.role === 'alert' ? 'failure route' : 'next step';
    const nextEdge: PipelineBuilderEdge = {
      id: makeId('edge'),
      sourceNodeId: connection.source,
      targetNodeId: connection.target,
      label,
    };
    setEdges((current) => [...current, nextEdge]);
    setSelection({ type: 'edge', id: nextEdge.id });
    setSaveState('Pipeline dependency added');
  }, [nodes]);

  const selectedIssueTarget = useCallback((target?: PipelineSelection) => {
    if (!target) return;
    setSelection(target);
    if (target.type === 'node') {
      const node = nodes.find((item) => item.id === target.id);
      if (node) {
        setCenter(node.position.x + (node.width / 2), node.position.y + (node.height / 2), { duration: 350, zoom: 0.75 });
      }
    }
  }, [nodes, setCenter]);

  const orderedIssues = useMemo(() => issues, [issues]);

  return (
    <div className="space-y-6">
      <Panel variant="elevated" className="overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.85fr)]">
          <div className="border-b border-[var(--border-soft)] px-5 py-4 sm:px-6 lg:border-b-0 lg:border-r">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">Prompt</h2>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                  {initialWorkspace.promptSections[0]?.body}
                </p>
              </div>
              <Badge variant="neutral">Visible context</Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {initialWorkspace.promptSections.slice(1).map((section) => (
                <div key={section.label} className="rounded-[18px] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">{section.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="px-5 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
                  Brainstorming scratchpad
                </h3>
                <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                  Capture orchestration assumptions, failure paths, SLA tradeoffs, and why this architecture is defensible in an interview.
                </p>
              </div>
              <Badge variant="info">Local only</Badge>
            </div>
            <textarea
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                setSaveState('Scratchpad updated locally');
              }}
              placeholder="Start with root jobs, then capture quality gates, alert routing, SLA expectations, and any orchestration tradeoffs."
              rows={7}
              className="mt-3 w-full rounded-[18px] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-3 text-sm leading-6 text-[var(--text-primary)] outline-none transition-colors focus:border-[var(--border-strong)]"
            />
          </div>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-stretch">
        <div className="space-y-6">
          <Panel variant="metallic" className="overflow-hidden p-0">
            <div className="border-b border-[var(--border-soft)] px-5 py-4 sm:px-6">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">Pipeline architecture canvas</h2>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
              <span className="rounded-full border border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 py-2">Search shapes</span>
              <span className="rounded-full border border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 py-2">Click to add</span>
              <span className="rounded-full border border-[var(--border-soft)] bg-[var(--bg-panel)] px-3 py-2">Drag onto canvas</span>
              <div className="ml-auto flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    zoomOut();
                    setZoomPercent((current) => Math.max(30, current - 10));
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] text-[var(--text-primary)]"
                  aria-label="Zoom out"
                >
                  <Minus className="size-4" />
                </button>
                <span className="rounded-full border border-[var(--border-soft)] bg-[var(--bg-panel)] px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)]">
                  Zoom {zoomPercent}%
                </span>
                <button
                  type="button"
                  onClick={() => {
                    zoomIn();
                    setZoomPercent((current) => Math.min(190, current + 10));
                  }}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-panel)] text-[var(--text-primary)]"
                  aria-label="Zoom in"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          </div>
            <div className="p-5 sm:p-6">
              <PipelineCanvas
                nodes={nodes}
                edges={edges}
                selected={selection}
                onNodesChange={handleNodesChange}
                onSelectNode={(nodeId) => {
                  setSelection({ type: 'node', id: nodeId });
                  setEditingTarget(null);
                }}
                onSelectEdge={(edgeId) => {
                  setSelection({ type: 'edge', id: edgeId });
                  setEditingTarget(null);
                }}
                onPaneClick={() => {
                  setSelection(null);
                  setEditingTarget(null);
                }}
                onConnectNodes={handleConnect}
                onAddShapeFromDrop={(shapeKind, position) => addShape(shapeKind as PipelineBuilderNode['shapeKind'], position)}
                onStartLabelEdit={(nodeId) => {
                  setSelection({ type: 'node', id: nodeId });
                  setEditingTarget({ type: 'label', id: nodeId });
                }}
                onStartConfigEdit={(nodeId) => {
                  setSelection({ type: 'node', id: nodeId });
                  setEditingTarget({ type: 'config', id: nodeId });
                }}
                onFinishEditing={() => setEditingTarget(null)}
                onUpdateLabel={(nodeId, value) => updateNode(nodeId, (node) => ({ ...node, label: value }))}
                onUpdateConfig={(nodeId, value) => updateNode(nodeId, (node) => ({ ...node, configSummary: value }))}
                editingTarget={editingTarget}
                setZoomPercent={setZoomPercent}
              />
            </div>
          </Panel>
          <div className="space-y-4">
            <WorkspaceStatusBar saveState={saveState} feedbackState={feedbackState} />
            <Panel variant="default" className="p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="secondary" onClick={resetWorkspace}>
                  <RefreshCcw className="size-4" />
                  Reset
                </Button>
                <Button variant="secondary" onClick={validate}>
                  <ShieldCheck className="size-4" />
                  Validate
                </Button>
                <Button variant="secondary" onClick={simulate}>
                  <Play className="size-4" />
                  Simulate
                </Button>
                <Button onClick={submit}>
                  <Send className="size-4" />
                  Submit
                </Button>
                <div className="ml-auto flex flex-wrap gap-2">
                  <Badge variant="neutral">{nodes.filter((node) => isPipelineNode(node.role)).length} pipeline nodes</Badge>
                  <Badge variant="neutral">{edges.length} dependencies</Badge>
                  <Badge variant="neutral">{nodes.filter((node) => node.role === 'support').length} support shapes</Badge>
                </div>
              </div>
            </Panel>

            {orderedIssues.length ? (
              <Panel variant="default" className="p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">Validation jump list</h2>
                  <Badge variant={orderedIssues.some((issue) => issue.severity === 'error') ? 'warning' : 'neutral'}>
                    {orderedIssues.length} issue{orderedIssues.length === 1 ? '' : 's'}
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3">
                  {orderedIssues.map((issue) => (
                    <button
                      key={issue.id}
                      type="button"
                      onClick={() => selectedIssueTarget(issue.target)}
                      className="rounded-[var(--radius-md)] border border-[var(--border-soft)] bg-[var(--bg-elevated)] px-4 py-4 text-left transition-colors duration-[130ms] ease-[var(--ease-standard)] hover:bg-[var(--bg-surface)]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{issue.issue}</p>
                          <p className="mt-2 text-sm leading-7 text-[var(--text-secondary)]">{issue.suggestedFix}</p>
                        </div>
                        <Badge variant={issue.severity === 'error' ? 'error' : 'warning'}>{issue.severity}</Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </Panel>
            ) : null}

            <ResultPanel model={resultPanel} />
          </div>
        </div>

        <PipelineBuilderPalette query={searchQuery} onQueryChange={setSearchQuery} onAddShape={addShape} />
      </div>
    </div>
  );
}

export function PipelineBuilderWorkspace({
  exerciseId,
  initialWorkspace,
}: {
  exerciseId: string;
  initialWorkspace: ExerciseWorkspaceProps;
}) {
  return (
    <ReactFlowProvider>
      <PipelineBuilderWorkspaceInner exerciseId={exerciseId} initialWorkspace={initialWorkspace} />
    </ReactFlowProvider>
  );
}
