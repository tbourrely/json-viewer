export type Node = {
  id: string,
  position: XYPosition,
  data: any,
  type: string,
};

export type Edge = {
  id: string,
  source: string,
  target: string,
  type: string,
  label?: string,
}

export type XYPosition = {
  x: number,
  y: number,
};

export type ObjectToNodeResult = {
  maxId: number,
  nodes: Node[],
  edges: Edge[],
}

export type CreateNodesResult = {
  nodes: Node[],
  edges: Edge[],
}

export type Previous = {
  id: string,
  key: string,
}

