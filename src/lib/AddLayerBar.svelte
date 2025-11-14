<script lang="ts">
    import { XMLParser } from 'fast-xml-parser';
    import type { Layer } from './types';
    import SearchResult from './SearchResult.svelte';

    let { onVisibleLayersChange }: {
        onVisibleLayersChange?: (layers: Layer[]) => void;
    } = $props();

    let search: string = $state("");
    let layerData: Layer[] = $state([]);
    let searchResults: Layer[] = $derived(
        search.trim() === ""
            ? []
            : layerData.filter(l => l['ows:Title']?.toLowerCase().includes(search.toLowerCase()))
    );

    let visibleLayers: Layer[] = $derived(layerData.filter(l => l.visible));

    $effect(() => {
        // Notify parent whenever visible layers change
        onVisibleLayersChange?.(visibleLayers);
        console.log(visibleLayers);
    });

    function toggleLayer(layer: Layer) {
        const index = layerData.findIndex(l => l === layer);
        if (index !== -1) {
            layerData[index].visible = !layerData[index].visible;
            // Trigger reactivity by reassigning the array
            layerData = [...layerData];
        }
    }

    async function load() {
        const parser = new XMLParser({
            ignoreAttributes: false
        });
        const resp = await fetch("https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml")
        const xmlString = await resp.text();
        const xml = parser.parse(xmlString);
        layerData = xml.Capabilities.Contents.Layer.map((d:Layer) => ({...d, visible: false}));
    }
    load();


</script>

<div>
    <input type="text" placeholder="Search for layers..." bind:value={search} />
    {#if searchResults.length > 0}
        <ul>
        {#each searchResults as result}
            <SearchResult {result} onToggle={() => toggleLayer(result)}></SearchResult>
        {/each}
        </ul>
    {/if}
</div>

<style lang="scss">
    div {
        position: fixed;
        left: 1em;
        top: 1em;
        display: flex;
        flex-direction: column;
    }

    input {
        min-width: 30em;
        margin: 0;
    }

    ul {
        margin: 0;
        padding: 0;
    }
</style>
