<script lang="ts">
    import type { Layer } from "./types";

    let { result, onToggle }: { result: Layer; onToggle: () => void } = $props();
</script>
<li>
    <div>{result["ows:Title"]}</div>
    <div><input type="checkbox" role="switch" checked={result.visible} onchange={onToggle} /></div>
</li>

<style lang="scss">
li {
    background: white;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    flex: 1 1;
    justify-content: space-between;
}
</style>
