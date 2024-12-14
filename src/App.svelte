<script lang="ts">
  import data from './assets/data.json';
  import { writable } from 'svelte/store';
  import {
    SvelteFlow,
    Controls,
  } from '@xyflow/svelte';
 
  // 👇 this is important! You need to import the styles for Svelte Flow to work
  import '@xyflow/svelte/dist/style.css';
  import JsonNode from './lib/JsonNode.svelte';
  import { createNodes } from './lib/create-nodes';

  const computedNodes = createNodes(data);

  console.debug(computedNodes.nodes)
  console.debug(computedNodes.edges)

  // We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
  const nodes = writable(computedNodes.nodes);

  // same for edges
  const edges = writable(computedNodes.edges);

  const snapGrid: [number, number] = [25, 25];

  const nodeTypes = {jsonNode: JsonNode}
</script>

<!--
👇 By default, the Svelte Flow container has a height of 100%.
This means that the parent container needs a height to render the flow.
-->
<div style:height="100vh" style:width="90vw">
  <SvelteFlow
    nodes={nodes as any}
    {edges}
    {snapGrid}
    {nodeTypes}
    fitView
    on:nodeclick={(event) => console.log('on node click', event.detail.node)}
  >
    <Controls />
  </SvelteFlow>
</div>
