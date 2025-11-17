<script lang="ts">
  import { buffer, rewind } from '@turf/turf';
  import type { Feature } from 'geojson';
  import { mapExtentWGS84, screenToCoords } from './conversion';
  import type { Layer } from './types';
  import { geoPath, type ExtendedFeature, type GeoProjection, geoMercator } from 'd3';

  interface InteractionLayerProps {
    projection: GeoProjection;
    layers: Layer[];
    updateProjection?: (projection: GeoProjection) => void;
  }

  // https://api3.geo.admin.ch/services/sdiservices.html#identify-features
  interface IdentifyRequest {
    geometry: string;
    geometryType: 'esriGeometryPoint';
    layers: string;
    mapExtent: string;
    // width, height, dpi
    imageDisplay: string;
    tolerance: string;
    returnGeometry?: 'true' | 'false';
    geometryFormat?: 'geojson' | 'esrijson';
    offset?: string;
    sr?: '21781' | '2056' | '4326' | '3857';
    lang?: 'de' | 'fr' | 'rm' | 'en';
    layerDefs?: string;
    callback?: string;
  }

  let { projection, layers, updateProjection }: InteractionLayerProps = $props();

  let features: ExtendedFeature[] = $state([]);
  let tooltip = $state<{ x: number; y: number; feature: ExtendedFeature } | null>(null);

  async function onMapClick(ev: MouseEvent) {
    if (layers.length == 0) {
      return;
    }
    const clickCoords = screenToCoords(projection, ev.clientX, ev.clientY);
    const mapExtent = mapExtentWGS84(projection);
    const req: IdentifyRequest = {
      geometry: `${clickCoords.lon},${clickCoords.lat}`,
      geometryType: 'esriGeometryPoint',
      geometryFormat: 'geojson',
      lang: 'en',
      sr: '4326',
      layers: `all:${layers.map((l) => l['ows:Identifier']).join(',')}`,
      mapExtent: `${mapExtent.minX},${mapExtent.minY},${mapExtent.maxX},${mapExtent.maxY}`,
      imageDisplay: `${window.innerWidth},${window.innerHeight},96`,
      tolerance: '10',
      returnGeometry: 'true',
    };

    const queryString = new URLSearchParams(req as unknown as Record<string, string>).toString();
    const url = `https://api3.geo.admin.ch/rest/services/ech/MapServer/identify?${queryString}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (!data.results || data.results.length == 0) {
        return;
      }
      features = [data.results[0]];

      const padding = 50;
      const p = geoMercator()
        .scale(projection.scale())
        .translate(projection.translate())
        .fitExtent(
          [
            [padding, padding],
            [window.innerWidth - padding, window.innerHeight - padding],
          ],
          rewind(buffer(features[0] as Feature, 500, { units: 'meters' })!, { reverse: true })
        );
      updateProjection?.(p);
    } catch (error) {
      console.error('Failed to fetch identify results:', error);
    }
  }

  function drawFeature(feature: ExtendedFeature) {
    const pathDrawer = geoPath(projection).pointRadius(10);
    const d = pathDrawer(feature);
    return d;
  }

  function showTooltip(ev: MouseEvent, feature: ExtendedFeature) {
    tooltip = {
      x: ev.clientX,
      y: ev.clientY,
      feature,
    };
  }

  function hideTooltip() {
    tooltip = null;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<rect width="10000" height="10000" onclick={onMapClick}></rect>
<g>
  {#each features as feature (feature.id)}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <path
      d={drawFeature(feature)}
      onmouseenter={(ev) => showTooltip(ev, feature)}
      onmouseleave={() => hideTooltip()}
      onmousemove={(ev) => showTooltip(ev, feature)}
    />
  {/each}
</g>

{#if tooltip}
  <foreignObject x={tooltip.x} y={tooltip.y} width="300" height="600" style="pointer-events: none;">
    <div class="tooltip">
      <dl>
        {#each Object.entries(tooltip.feature.properties as Record<string, string>) as [key, value] (key)}
          <dt>{key}</dt>
          <dd>{value}</dd>
        {/each}
      </dl>
    </div>
  </foreignObject>
{/if}

<style lang="scss">
  rect {
    opacity: 0;
  }

  path {
    fill: none;
    stroke: rgba(255, 0, 0, 0.5);
    stroke-width: 10px;
    cursor: pointer;
    stroke-linecap: round;
  }

  .tooltip {
    pointer-events: none;
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 0.75em;
    border-radius: 0.5em;
    font-size: 60%;
    white-space: pre-line;
    pointer-events: none;
    max-width: 300px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    dl {
      color: white;
      dt {
        font-weight: bold;
      }
      dd {
        margin-left: 1em;
      }
    }
  }
</style>
