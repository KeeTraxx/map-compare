<script lang="ts">
    import * as d3tile from "d3-tile";

    import * as d3 from "d3";
    let gEl: SVGGElement;

    let { projection, urlFunction, zoomDelta = 0 }: {
        projection: d3.GeoProjection;
        urlFunction: (x: number, y: number, z: number) => string;
        zoomDelta?: number;
    } = $props();

    let tile = d3tile.tile().tileSize(256).maxNativeZoom(19).clampX(false);

    $effect(() => {
        drawTiles(gEl, projection, zoomDelta);
    });

    function drawTiles(el: SVGGElement, projection: d3.GeoProjection, zoomDelta: number): void {
        const tiles = tile.size([window.innerWidth, window.innerHeight]).zoomDelta(zoomDelta)(
            d3.zoomIdentity
                .translate(projection.translate()[0], projection.translate()[1])
                .scale(projection.scale() * 2 * Math.PI)
        );

        d3.select(el)
            .selectAll<SVGImageElement, [number, number, number]>("image")
            .data<any>(tiles, (d) => d)
            .join("image")
            .attr("xlink:href", ([x, y, z]) => urlFunction(x, y, z))
            .attr("x", ([x]) => (x + tiles.translate[0]) * tiles.scale)
            .attr("y", ([, y]) => (y + tiles.translate[1]) * tiles.scale)
            .attr("width", tiles.scale)
            .attr("height", tiles.scale);
    }
</script>

<g bind:this={gEl}> </g>
