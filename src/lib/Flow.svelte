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

  const nodes = writable([]);
  const edges = writable([]);

  const snapGrid: [number, number] = [25, 25];
  const nodeTypes = {jsonNode: JsonNode}

  const {deleteElements} = useSvelteFlow();

  let { file } = $props();
  $effect(() => {
    const nodeList = get(nodes);
    const edgeList = get(edges);
    (async () => await deleteElements({ nodes: nodeList, edges: edgeList }))(); 

    if (file !== '') {
      Object.values(files)[file]().then(async (content: any) => {
        const computedNodes = createNodes(content.default);
        nodes.set(computedNodes.nodes as any);
        edges.set(computedNodes.edges as any);
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
