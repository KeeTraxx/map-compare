# D3 Swisstopo Map Viewer

An interactive map viewer built with Svelte 5 and D3.js for exploring Swiss geographic data from Swisstopo's WMTS services.

## Features

- **Interactive Map Navigation**: Pan and zoom with D3 zoom behavior
- **Layer Management**: Search and add multiple Swisstopo WMTS layers
- **Dynamic Tile Loading**: Efficient tile-based rendering with d3-tile
- **Error Handling**: Failed tiles display as gray rectangles with "no data" indicator
- **Layer Legends**: Automatic legend display for layers that provide them

## Technology Stack

- **Svelte 5** - Modern reactive UI framework with runes
- **D3.js** - Data visualization and map projections
- **d3-tile** - Tile generation for WMTS layers
- **Turf.js** - Geospatial calculations
- **TypeScript** - Type-safe development
- **fast-xml-parser** - Parse WMTS capabilities XML
- **Pico CSS** - Minimal styling framework
- **Vite** - Fast build tool

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open your browser to the URL shown in the terminal (typically http://localhost:5173).

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Search for Layers**: Use the search bar in the top-left to find Swisstopo layers
2. **Add Layers**: Click the toggle switch to add/remove layers from the map
3. **Navigate**: Click and drag to pan, scroll to zoom
4. **View Legends**: Layer legends appear in the top-right when available

## Project Structure

```
src/
├── lib/
│   ├── AddLayerBar.svelte    # Layer search and selection UI
│   ├── Map.svelte             # Main map component with D3 zoom
│   ├── WTMSLayer.svelte       # WMTS tile layer renderer
│   ├── SearchResult.svelte    # Individual search result item
│   ├── InteractionLayer.svelte # Map interaction handling
│   ├── NerdStats.svelte       # Debug/stats display
│   └── types.ts               # TypeScript type definitions
├── App.svelte                 # Root component
└── main.ts                    # Application entry point
```

## Development Commands

```bash
# Type checking
npm run check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
```

## Data Source

This application uses the [Swisstopo WMTS service](https://wmts.geo.admin.ch) for map tiles and layers. Layer metadata is fetched from:

- https://wmts.geo.admin.ch/EPSG/3857/1.0.0/WMTSCapabilities.xml

## License

MIT License - Copyright (c) 2025 Khôi Tran

See [LICENSE](LICENSE) file for details.
