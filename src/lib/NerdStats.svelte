<script lang="ts">
    import * as d3 from 'd3';
    let {projection} : {projection: d3.GeoProjection} = $props();

    let center = $derived.by(() => {
        const [x, y] = projection.translate();
        const coords = projection.invert?.([window.innerWidth / 2, window.innerHeight / 2]);
        return coords ? {
            lon: coords[0].toFixed(6),
            lat: coords[1].toFixed(6)
        } : null;
    });
</script>

<div class="r">
    {#if center}
        <div>Lon: {center.lon}</div>
        <div>Lat: {center.lat}</div>
    {/if}
</div>

<style lang="scss">
    div.r {
        position: fixed;
        bottom: 1em;
        right: 1em;
        background-color: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 0.5em;
        border-radius: 0.5em;
        font-size: 60%;
    }
</style>