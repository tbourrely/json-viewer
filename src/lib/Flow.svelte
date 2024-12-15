<script lang="ts">
  import { get, writable } from 'svelte/store';
  import {
    SvelteFlow,
    useSvelteFlow,
    type Node,
  } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import JsonNode from './JsonNode.svelte';
  import { createNodes } from './create-nodes';
  import { files } from './files';
  import { getLayoutedElements, initGraph } from './layout';
  import type { XYPosition } from './types';

  const nodes = writable([]);
  const edges = writable([]);

  const snapGrid: [number, number] = [25, 25];
  const nodeTypes = {jsonNode: JsonNode}

  const { deleteElements, setCenter } = useSvelteFlow();

  const graph = initGraph();
  const nodeWidth = 300;
  const nodeHeight = 400;

  let { file } = $props();

  $effect(() => {
    const nodeList = get(nodes);
    const edgeList = get(edges);
    (async () => await deleteElements({ nodes: nodeList, edges: edgeList }))(); 

    if (file !== '') {
      Object.values(files)[file]().then(async (content: any) => {
        const computedNodes = createNodes(content.default);
        const {
          nodes: layoutedNodes,
          edges: layoutedEdges
        } = getLayoutedElements(
          graph,
          nodeWidth,
          nodeHeight,
          computedNodes.nodes,
          computedNodes.edges,
        );
        nodes.set(layoutedNodes as any);
        edges.set(layoutedEdges as any);

        if (layoutedNodes[0]) {
          const center = computeCenter(layoutedNodes[0], nodeWidth, nodeHeight);
          setCenter(
            center.x,
            center.y,
            { zoom: 1.5 },
          );
        }
      });
    }
  })

  function computeCenter(node: Node, fallbackWidth: number, fallbackHeight: number): XYPosition {
    return {
      x: node.position.x + (node.width || fallbackWidth / 2),
      y: node.position.y + (node.height || fallbackHeight / 2),
    }
  }
</script>

<SvelteFlow
  nodes={nodes as any}
  onlyRenderVisibleElements
  {edges}
  {snapGrid}
  {nodeTypes}
  class="flow"
>
</SvelteFlow>

<style>
:global(.flow) {
  background-color: #282A36!important;
}

:global(.svelte-flow__node) {
  background-color: #F8F8F2!important;
  color: #44475A!important;
  border: 3px solid #6272A4;
}

:global(.svelte-flow__handle) {
  background-color: transparent!important;
  border: none;
}

:global(.svelte-flow__edge-label) {
  color: #44475A!important;
}
</style>
