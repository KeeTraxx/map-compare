<script lang="ts">
    import type { Layer } from "./types";

    let { result, showAbstract = true, onToggle }: { result: Layer; showAbstract: boolean, onToggle: () => void } = $props();
</script>
<li>
    <div class="left">
        <h6>{result["ows:Title"]}</h6>
        {#if showAbstract}<p>{result["ows:Abstract"]}</p>{/if}
    </div>
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
    padding: 0.3em;
    border-radius: 0.2em;

    h6 {
        font-size: 60%;
        margin-bottom: 0.5em;
        max-width: 90%;
    }

    p {
        font-size: 60%;
        max-width: 90%;
    }

    border-bottom: 1px solid rgba(0,0,0,0.1);

    .left {
        max-width: 90%;
        flex: 1 1;
    }
}


</style>
