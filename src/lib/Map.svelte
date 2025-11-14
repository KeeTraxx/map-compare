<script lang="ts">
    import * as d3 from "d3";
    import { onMount } from "svelte";
    import { rewind, buffer, point } from "@turf/turf";
    import WTMSLayer from "./WTMSLayer.svelte";
    import type { Layer } from "./types";

    let {layers} : {layers: Layer[]} = $props();

    let svgEl: SVGElement;
    let projection = d3
        .geoMercator()
        .fitSize(
            [window.innerWidth, window.innerHeight],
            rewind(
                buffer(point([7.447798611764711, 46.947948827484964]), 500, { units: "meters" })!,
                { reverse: true }
            )
        );

    let zoom = d3.zoom<SVGElement, unknown>().on("zoom", (ev) => {
        const transform = ev.transform;
        projection = projection.scale(transform.k).translate([transform.x, transform.y]);
        console.log("zoomed");
    });

    onMount(() => {
        d3.select<SVGElement, unknown>(svgEl)
            .call(zoom)
            .call(
                zoom.transform,
                d3.zoomIdentity
                    .translate(projection.translate()[0], projection.translate()[1])
                    .scale(projection.scale())
            );
    });
</script>

<svg bind:this={svgEl}>
    <WTMSLayer
        {projection}
        zoomDelta={-2}
        urlFunction={(x, y, z) =>
            `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/${z}/${x}/${y}.jpeg`}
    />

    <WTMSLayer
        {projection}
        urlFunction={(x, y, z) =>
            `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/${z}/${x}/${y}.jpeg`}
    />
</svg>

<style lang="scss">
    svg {
        flex: 1 1 240px;
    }
</style>
