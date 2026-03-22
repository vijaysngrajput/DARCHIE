import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DataModelingWorkspace } from '@/components/practice/data-modeling-workspace';
import { getWorkspaceExercise } from '@/lib/practice-data';

vi.mock('@xyflow/react', async () => {
  const React = await import('react');

  return {
    ReactFlowProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    ReactFlow: ({
      nodes,
      edges,
      onNodeClick,
      onNodeDoubleClick,
      onEdgeClick,
      onConnect,
      onSelectionChange,
      onMoveEnd,
      children,
    }: {
      nodes: Array<{
        id: string;
        data: {
          label: string;
          selected?: boolean;
          shapeKind?: string;
          isEditing?: boolean;
          onStartEditing?: (id: string) => void;
        };
      }>;
      edges: Array<{ id: string; label?: string }>;
      onNodeClick?: (event: unknown, node: { id: string }) => void;
      onNodeDoubleClick?: (event: unknown, node: { id: string }) => void;
      onEdgeClick?: (event: unknown, edge: { id: string }) => void;
      onConnect?: (connection: { source: string; target: string }) => void;
      onSelectionChange?: (selection: { nodes: Array<{ id: string }>; edges: Array<{ id: string }> }) => void;
      onMoveEnd?: (_event: unknown, viewport: { zoom: number }) => void;
      children?: React.ReactNode;
    }) => (
      <div>
        <button type="button" onClick={() => onConnect?.({ source: nodes[0]?.id, target: nodes[1]?.id })}>
          Mock connect
        </button>
        <button type="button" onClick={() => onSelectionChange?.({ nodes: nodes.slice(0, 2).map((node) => ({ id: node.id })), edges: [] })}>
          Mock multi-select
        </button>
        <button type="button" onClick={() => onMoveEnd?.({}, { zoom: 1.2 })}>
          Mock move end
        </button>
        {nodes.map((node) => (
          <React.Fragment key={node.id}>
            <button type="button" onClick={() => onNodeClick?.({}, { id: node.id })} onDoubleClick={() => onNodeDoubleClick?.({}, { id: node.id })}>
              Select node {node.data.label || node.id}
            </button>
            {node.data.isEditing ? (
              <input aria-label={`Edit node ${node.data.label || node.id}`} defaultValue={node.data.label || node.id} />
            ) : null}
          </React.Fragment>
        ))}
        {edges.map((edge) => (
          <button key={edge.id} type="button" onClick={() => onEdgeClick?.({}, { id: edge.id })}>
            Select relationship {edge.label || edge.id}
          </button>
        ))}
        {children}
      </div>
    ),
    Background: () => <div>Canvas background</div>,
    MiniMap: () => <div>Canvas mini map</div>,
    Controls: () => <div>Canvas controls</div>,
    Handle: () => <div data-testid="flow-handle" />,
    NodeResizer: () => <div data-testid="node-resizer" />,
    useReactFlow: () => ({
      screenToFlowPosition: ({ x, y }: { x: number; y: number }) => ({ x, y }),
      setCenter: vi.fn(),
      fitView: vi.fn(),
      getZoom: () => 1,
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
    }),
    Position: { Left: 'left', Right: 'right' },
    BackgroundVariant: { Dots: 'dots' },
    ConnectionMode: { Loose: 'loose' },
    MarkerType: { ArrowClosed: 'arrowclosed' },
    applyNodeChanges: (_changes: unknown, nodes: unknown) => nodes,
    applyEdgeChanges: (_changes: unknown, edges: unknown) => edges,
  };
});

const initialWorkspace = getWorkspaceExercise('data-modeling', 'marketplace-core-entities');

describe('DataModelingWorkspace', () => {
  it('renders the redesigned canvas layout without the old exercise header block', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<DataModelingWorkspace exerciseId="marketplace-core-entities" initialWorkspace={initialWorkspace} />);

    expect(screen.queryByRole('heading', { name: /marketplace core entities/i })).not.toBeInTheDocument();
    expect(screen.getByText(/builder palette/i)).toBeInTheDocument();
    expect(screen.getByText(/architecture and erd canvas/i)).toBeInTheDocument();
    expect(screen.getAllByText(/review panel/i).length).toBeGreaterThan(0);
  });

  it('adds supporting shapes from the palette without relying on the old config rail', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<DataModelingWorkspace exerciseId="marketplace-core-entities" initialWorkspace={initialWorkspace} />);

    fireEvent.click(screen.getByRole('button', { name: /add note/i }));

    expect(screen.getAllByText(/1 support shapes/i).length).toBeGreaterThan(0);
  });

  it('validates ERD items and ignores support shapes as blockers', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<DataModelingWorkspace exerciseId="marketplace-core-entities" initialWorkspace={initialWorkspace} />);

    fireEvent.click(screen.getByRole('button', { name: /add entity \/ table/i }));
    fireEvent.click(screen.getByRole('button', { name: /validate/i }));

    expect(screen.getAllByText(/1 blocking issue/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/missing a name/i).length).toBeGreaterThan(0);
  });

  it('supports inline rename mode for selected entities', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<DataModelingWorkspace exerciseId="marketplace-core-entities" initialWorkspace={initialWorkspace} />);

    fireEvent.doubleClick(screen.getByRole('button', { name: /select node users/i }));

    expect(screen.getByRole('textbox', { name: /edit node users/i })).toBeInTheDocument();
  });

  it('allows relationship cardinality editing in the bottom inspector', () => {
    if (!initialWorkspace) throw new Error('initial workspace missing');

    render(<DataModelingWorkspace exerciseId="marketplace-core-entities" initialWorkspace={initialWorkspace} />);

    fireEvent.click(screen.getByRole('button', { name: /mock connect/i }));

    expect(screen.getByText(/relationship tools/i)).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: '1:N' })[0]);
    expect(screen.getAllByText('1:N').length).toBeGreaterThan(0);
  });
});
