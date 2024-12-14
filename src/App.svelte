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
  import { objectToNode } from './lib/transform-json';

  // We are using writables for the nodes and edges to sync them easily. When a user drags a node for example, Svelte Flow updates its position.
  const computedNodes = objectToNode(0, { x: 0, y: 0 }, data[0]).nodes;
  console.log(computedNodes)
  const nodes = writable(computedNodes);

  // same for edges
  const edges = writable([
    //{
    //  id: '1-2',
    //  type: 'default',
    //  source: '1',
    //  target: '2',
    //  label: 'Edge Text'
    //}
  ]);

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
