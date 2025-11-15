<script lang="ts">
  import * as d3 from 'd3';
  import { onMount } from 'svelte';
  import { rewind, buffer, point } from '@turf/turf';
  import WTMSLayer from './WTMSLayer.svelte';
  import type { Layer } from './types';
  import NerdStats from './NerdStats.svelte';
  import InteractionLayer from './InteractionLayer.svelte';

  let { layers }: { layers: Layer[] } = $props();

  let svgEl: SVGElement;
  let projection: d3.GeoProjection = $state(
    d3.geoMercator().fitSize(
      [window.innerWidth, window.innerHeight],
      rewind(
        buffer(point([7.447798611764711, 46.947948827484964]), 500, {
          units: 'meters',
        })!,
        { reverse: true }
      )
    )
  )!;

  let zoom = d3.zoom<SVGElement, unknown>().on('zoom', (ev) => {
    const transform = ev.transform;
    // Create new projection to trigger Svelte reactivity
    projection = d3.geoMercator().scale(transform.k).translate([transform.x, transform.y]);
  });

  function updateProjection(newProjection: d3.GeoProjection) {
    projection = newProjection;
    d3.select<SVGElement, unknown>(svgEl).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(projection.translate()[0], projection.translate()[1])
        .scale(projection.scale())
    );
  }

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
  <g style="opacity: 0.3">
    <WTMSLayer
      {projection}
      urlFunction={(x, y, z) =>
        `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/${z}/${x}/${y}.jpeg`}
    />
  </g>

  {#each layers as layer (layer['ows:Identifier'])}
    <WTMSLayer
      {projection}
      urlFunction={(x, y, z) =>
        layer.ResourceURL['@_template']
          .replace('{Time}', layer.Dimension.Default)
          .replace('{TileMatrix}', z.toString())
          .replace('{TileCol}', x.toString())
          .replace('{TileRow}', y.toString())}
    />
  {/each}
  <InteractionLayer {projection} {layers} {updateProjection} />
</svg>
<NerdStats {projection}></NerdStats>

<ul class="legend">
  {#each layers as layer (layer['ows:Identifier'])}
    {#if layer.Style.LegendURL}
      <li>
        <h6>{layer['ows:Title']}</h6>
        <img alt={layer['ows:Identifier']} src={layer.Style.LegendURL['@_xlink:href']} />
      </li>
    {/if}
  {/each}
</ul>

<style lang="scss">
  svg {
    flex: 1 1 240px;
  }

  ul {
    position: fixed;
    top: 1em;
    right: 1em;
    display: flex;
    flex-direction: column;
    gap: 1em;
    > li {
      margin: 0;
      padding: 0;
      list-style-type: none;
      background: white;
      padding: 0.5em;
      border-radius: 0.5em;
      box-shadow: 2px 2px 5px 5px rgba(0, 0, 0, 0.3);
    }
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
</style>
