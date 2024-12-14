<script lang="ts">
  import { Handle, Position, type NodeProps } from "@xyflow/svelte";
  type $$Props = NodeProps;

  export let data: $$Props['data'];
  export let isConnectable: $$Props['isConnectable'];

  const { content } = data;
</script>

<Handle type="target" position={Position.Top} style="background: #555;" {isConnectable} />
<div>
  {#each Object.entries(content as any) as entry}
    <div>
      <span class="key">{entry[0]}</span>
      <span class="separator"> : </span>
      <span class="value">{entry[1]}</span>
    </div>
  {/each}
</div>
<Handle type="source" position={Position.Bottom} style="background: #555;" {isConnectable} />

<style>
  :global(.svelte-flow__node-jsonNode) {
    font-size: 0.8rem;
    border: 1px solid black;
    padding: 1rem;
    border-radius: 5px;
    text-align: center;
  }

  .key {
    color: #BD93F9;
  }

  .value {
    color: #44475A;
  }
</style>
