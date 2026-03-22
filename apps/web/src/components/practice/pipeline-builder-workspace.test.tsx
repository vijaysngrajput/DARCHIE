import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { PipelineBuilderWorkspace } from '@/components/practice/pipeline-builder-workspace';
import { getWorkspaceExercise } from '@/lib/practice-data';

vi.mock('@xyflow/react', async () => {
  const React = await import('react');

  return {
    ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ReactFlow: ({
      nodes,
      edges,
      onNodeClick,
      onEdgeClick,
      onConnect,
      children,
    }: {
      nodes: Array<{ id: string; data: { label: string } }>;
      edges: Array<{ id: string; label?: string }>;
      onNodeClick?: (event: unknown, node: { id: string }) => void;
      onEdgeClick?: (event: unknown, edge: { id: string }) => void;
      onConnect?: (connection: { source: string; target: string }) => void;
      children?: React.ReactNode;
    }) => (
      <div>
        <button type="button" onClick={() => onConnect?.({ source: nodes[0]?.id, target: nodes[1]?.id })}>
          Mock connect
        </button>
        {nodes.map((node) => (
          <button key={node.id} type="button" onClick={() => onNodeClick?.({}, { id: node.id })}>
            Select pipeline node {node.data.label}
          </button>
        ))}
        {edges.map((edge) => (
          <button key={edge.id} type="button" onClick={() => onEdgeClick?.({}, { id: edge.id })}>
            Select edge {edge.label || edge.id}
          </button>
        ))}
        {children}
      </div>
    ),
    Background: () => <div>Canvas background</div>,
    Handle: () => <div data-testid="flow-handle" />,
    useReactFlow: () => ({
      screenToFlowPosition: ({ x, y }: { x: number; y: number }) => ({ x, y }),
      setCenter: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
    }),
    Position: { Left: 'left', Right: 'right' },
    BackgroundVariant: { Dots: 'dots' },
    ConnectionMode: { Loose: 'loose' },
    MarkerType: { ArrowClosed: 'arrowclosed' },
  };
});

const initialWorkspace = getWorkspaceExercise('pipeline-builder', 'daily-orders-etl');

describe('PipelineBuilderWorkspace', () => {
  it('renders a dedicated searchable pipeline builder instead of the old generic shell', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<PipelineBuilderWorkspace exerciseId="daily-orders-etl" initialWorkspace={initialWorkspace} />);

    expect(screen.getByText(/pipeline architecture canvas/i)).toBeInTheDocument();
    expect(screen.getByText(/builder palette/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search shapes, providers, or keywords/i)).toBeInTheDocument();
  });

  it('filters the branded palette by keyword search', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<PipelineBuilderWorkspace exerciseId="daily-orders-etl" initialWorkspace={initialWorkspace} />);

    fireEvent.change(screen.getByPlaceholderText(/search shapes, providers, or keywords/i), { target: { value: 'redshift' } });

    expect(screen.getByRole('button', { name: /add redshift/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /add flink/i })).not.toBeInTheDocument();
  });

  it('adds branded shapes from the searchable palette', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<PipelineBuilderWorkspace exerciseId="daily-orders-etl" initialWorkspace={initialWorkspace} />);

    fireEvent.click(screen.getByRole('button', { name: /add flink/i }));

    expect(screen.getByText(/7 pipeline nodes/i)).toBeInTheDocument();
  });

  it('validates the pipeline graph and supports mocked simulation', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<PipelineBuilderWorkspace exerciseId="daily-orders-etl" initialWorkspace={initialWorkspace} />);

    fireEvent.click(screen.getByRole('button', { name: /^Validate$/i }));

    fireEvent.click(screen.getByRole('button', { name: /^Simulate$/i }));
    expect(screen.getAllByText(/simulation path is ready/i).length).toBeGreaterThan(0);
  });
});
