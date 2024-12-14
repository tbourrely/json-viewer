<script lang="ts">
    import { SvelteFlowProvider } from "@xyflow/svelte";
  import Flow from "./lib/Flow.svelte";
  import { files } from "./lib/files";

  let file = $state('');
</script>

<div style:height="100vh" style:width="100vw">
  <SvelteFlowProvider>
    <Flow {file} />
  </SvelteFlowProvider>

  <div class="file">
    <label for="file-select">Choose a file:</label>

    <select name="files" id="file-select" bind:value={file}>
      <option value="">--Please choose an option--</option>
      {#each Object.keys(files) as file, index }
        <option value={index}>{file.split('/').pop()}</option>
      {/each}
    </select>
  </div>

  {file}
</div>

<style>
.file {
  position: absolute;
  top: 1rem;
  left: 1rem;
}
</style>
