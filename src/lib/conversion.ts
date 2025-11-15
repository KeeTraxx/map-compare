import proj4 from 'proj4';

export interface Coords {
  lon: number;
  lat: number;
  lv95x: number;
  lv95y: number;
}

// LV95
proj4.defs(
  'EPSG:2056',
  '+proj=somerc +lat_0=46.9524055555556 +lon_0=7.43958333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs +type=crs'
);

const toLv95 = proj4('WGS84', 'EPSG:2056');

export function wgs84ToLv95([lat, lon]: [number, number]) {
  return toLv95.forward([lat, lon]);
}

export function screenToCoords(
  projection: d3.GeoProjection,
  screenX: number,
  screenY: number
): Coords {
  if (!projection || !projection.invert) {
    throw new Error('projection is null');
  }
  const wgs84 = projection.invert([screenX, screenY])!;
  const [lon, lat] = wgs84;
  const [lv95x, lv95y] = wgs84ToLv95([lon, lat]);
  return {
    lon,
    lat,
    lv95x,
    lv95y,
  };
}

export function mapExtentWGS84(projection: d3.GeoProjection) {
  if (!projection || !projection.invert) {
    throw new Error('projection is null');
  }
  const [minX, minY] = projection.invert([0, 0])!;
  const [maxX, maxY] = projection.invert([window.innerWidth, window.innerHeight])!;
  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}

export function mapExtentLV95(projection: d3.GeoProjection) {
  if (!projection || !projection.invert) {
    throw new Error('projection is null');
  }
  const [minX, minY] = wgs84ToLv95(projection.invert([0, 0])!);
  const [maxX, maxY] = wgs84ToLv95(projection.invert([window.innerWidth, window.innerHeight])!);
  return {
    minX,
    minY,
    maxX,
    maxY,
  };
}
