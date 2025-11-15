<script lang="ts">
  import AddLayerBar from './lib/AddLayerBar.svelte';
  import Map from './lib/Map.svelte';
  import type { Layer } from './lib/types';

  let layers: Layer[] = $state([]);
</script>

<Map {layers}></Map>
<aside>
  <AddLayerBar onVisibleLayersChange={(newLayers) => (layers = newLayers)}></AddLayerBar>
</aside>
