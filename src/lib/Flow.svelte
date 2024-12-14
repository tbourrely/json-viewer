<script lang="ts">
  import { get, writable } from 'svelte/store';
  import {
    SvelteFlow,
    Controls,
    useSvelteFlow,
  } from '@xyflow/svelte';
  import '@xyflow/svelte/dist/style.css';
  import JsonNode from './JsonNode.svelte';
  import { createNodes } from './create-nodes';
  import { files } from './files';
  import { getLayoutedElements, initGraph } from './layout';

  const nodes = writable([]);
  const edges = writable([]);

  const snapGrid: [number, number] = [25, 25];
  const nodeTypes = {jsonNode: JsonNode}

  const { deleteElements } = useSvelteFlow();

  const graph = initGraph();
  const nodeWidth = 300;
  const nodeHeight = 200;

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
      });
    }
  })
</script>

<SvelteFlow
  nodes={nodes as any}
  {edges}
  {snapGrid}
  {nodeTypes}
  fitView
>
  <Controls />
</SvelteFlow>
