<script lang="ts">
  import * as d3 from 'd3';
  import { screenToCoords } from './conversion';
  let { projection }: { projection: d3.GeoProjection } = $props();

  let center = $derived.by(() => {
    return screenToCoords(projection, window.innerWidth / 2, window.innerHeight / 2);
  });
</script>

<div class="r">
  {#if center}
    <div>Lon: {center.lon.toFixed(6)}</div>
    <div>Lat: {center.lat.toFixed(6)}</div>
    <div>LV95 X: {center.lv95x.toFixed(6)}</div>
    <div>LV95 Y: {center.lv95y.toFixed(6)}</div>
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
