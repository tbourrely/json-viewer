import dagre from '@dagrejs/dagre';
import { type Edge, type Node, Position } from '@xyflow/svelte';

export function initGraph() {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  return dagreGraph;
} 

export function getLayoutedElements(
  graph: dagre.graphlib.Graph,
  nodeWidth: number,
  nodeHeight: number,
  nodes: Node[],
  edges: Edge[],
  direction = 'TB',
) {
  graph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    graph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target);
  });

  dagre.layout(graph);

  nodes.forEach((node) => {
    const nodeWithPosition = graph.node(node.id);
    node.targetPosition = Position.Top;
    node.sourcePosition = Position.Bottom;

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2
    };
  });

  return { nodes, edges };
}
